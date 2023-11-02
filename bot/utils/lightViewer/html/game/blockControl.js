/*
 ____  __     __    ___  __ _     ___  __   __ _  ____  ____   __   __   
(  _ \(  )   /  \  / __)(  / )   / __)/  \ (  ( \(_  _)(  _ \ /  \ (  )  
 ) _ (/ (_/\(  O )( (__  )  (   ( (__(  O )/    /  )(   )   /(  O )/ (_/\
(____/\____/ \__/  \___)(__\_)   \___)\__/ \_)__) (__) (__\_) \__/ \____/
Chunk / block / sector control. As well as communicating with & starting the culling process. 
Also takes care of the build & delete buffers.

*/


//Block counter
var blockCount=0;

//list of active chunks
var activeChunks=[];

//Chunk List and Sector List
var chunk=[];
var sector=[];
//Reference a sector with sector[ID] and chunks with chunk[ID]
//You can get a sector/chunks ID with return_sectorID and return_chunkID and inputting the XYZ

                           //X    Y       Z
//Chunk contains blocks chunkXY*chunkXY*chunkZ

//Chunk Dimensions
var chunkSpace=200;
var chunkXY=32;
var chunkZ=32;
						    //X    Y         Z
//Sector contains chunks sectorXY*sectorXY*sectorZ

//Sector Dimensions 
var sectorSpace=200;
var sectorXY=1;
var sectorZ=10;






//Generate blockList for each block in a chunk
var chunkList=[];
for(var zz=0;zz<chunkZ;zz++){
	for(var yy=0;yy<chunkXY;yy++){
		for(var xx=0;xx<chunkXY;xx++){
			//Add empty block to chunkList
			chunkList.push(-1);
		}
	}
}


chunkList = new Uint8Array(chunkList.length);
//Fill it with 0, to make it empty
chunkList.fill(0);


//Buffers to send to workers 
var buildBuffer = [];
var deleteBuffer = [];



//Function to send our data over to the workers
buffers_send = function(){
	
	
	
	
	//If buildBuffer has data send it
	if(buildBuffer.length>0){	
		cullWorker.postMessage({
			id : "block_create",
			buffer : buildBuffer,
		});
		//message_send(["block_create",buildBuffer]);
		buildBuffer=[];
	}
	//If deleteBuffer has data send it
	if(deleteBuffer.length>0){
		
		cullWorker.postMessage({
			id : "block_delete",
			buffer : deleteBuffer,
		});
	//message_send(["block_delete",deleteBuffer]);
	deleteBuffer=[];
	}
		
}

//Function to create new cull Worker
function newCullWorker(){
	

	
	//Start culling proccess and send chunk data
	cullWorker = new Worker('./render/renderCulling.js');

	console.log('CULLWORKER');


	//CullWorker Messaging
	cullWorker.addEventListener('message', function(e) {

	  message = e.data;
	  switch(message.id){

			case "downloadData":
			download('map.txt',message.data);
			break;
		
		  //Receive culling Data
		  case "meshUpdate":
			  chunkMeshed+=1;
			  statusText.innerHTML = "Meshing chunks: "+chunkMeshed+'/'+chunkDownloaded;
			  if(chunkMeshed == chunkDownloaded){
				  statusText.innerHTML = "Map successfully meshed";
			  }
		  break;
		  case "drawData":
		 //For each message the cull buffer received
		  var loopLen=message.sendList.length;
		  for(var kk=0;kk<loopLen;kk++){
		  
		  receive = message.sendList[kk];
		  
		  //Make sure we didn't receive empty data
		  if(receive!=undefined){
				//Get chunk ID
			var chunkID = return_chunkID(receive.coords[0],receive.coords[1],receive.coords[2]);
				//Create chunk if needed
			if(chunk[chunkID]==null){
				chunk_create(receive.coords[0],receive.coords[1],receive.coords[2]);
			}
				//Set the position & color buffers, and also the blockList
			chunk[chunkID].blockDraws.position=receive.position;
			chunk[chunkID].blockDraws.color=receive.color;
			if(receive.blockList!=null){
				chunk[chunkID].blockList=receive.blockList;		
			}
			
			//Find sector of chunk
			var sectorCoords = sector_get(receive.coords[0],receive.coords[1],receive.coords[2]);
			var sectorID = return_sectorID(sectorCoords[0],sectorCoords[1],sectorCoords[2]);
			//Either create a new sector if needed, or flag existing sector for a redraw
			if(sector[sectorID]!=null){
			sector[sectorID].reDraw=1;
			}else{
			sector_create(sectorCoords[0],sectorCoords[1],sectorCoords[2]);
			}
		  }
		  }
		  break;
	  }
	});


	//Send info on chunk size and cullView 
	cullWorker.postMessage({
		id : 'start',
		chunkXY : chunkXY,
		chunkZ : chunkZ,
		viewDist : viewDist,
		zView : zView,
	});

}

//Create new cull worker thread
newCullWorker();

//Update the culling process on where to cull
//Basically just a 0.5second interval that updates camera position
setInterval(function(){
	cullWorker.postMessage({
		id : 'camera',
		cam : cam,
		viewDist : viewDist,
		zView : zView,
	});
},500);



//Create chunk
chunk_create = function(x,y,z){
	var chunkID = return_chunkID(x,y,z);
	activeChunks.push(chunkID);
	if(chunk[chunkID]==null){
		//Create new chunk
		chunk[chunkID]={
			//coordinates
			coords : [x,y,z],
			//List of blocks -1 meaning no block
			blockList : [],	
			//Final draw of the chunk
			blockDraws : {
				position : [],
				color : [],
			},
			
		}

	}
}



sector_create = function(x,y,z){
	var sectorID = return_sectorID(x,y,z);
	if(sector[sectorID]==null){
		//Create new chunk
		sector[sectorID]={
			reDraw : 1,
			//coordinates
			coords : [x,y,z],	
			//Final draw of the chunk, this is just for writing to the gl.buffers
			//These get cleared out after setting the sector's buffers to save RAM
			blockDraws : {
				position : [],
				color : [],
			},
			//Empty buffers
			buffers : {
			 position :gl.createBuffer(),
			color : gl.createBuffer(),
			size : 0,
			},
			
			//Vertex Array Object
			vao : gl.createVertexArray(),
			
		}
		
	//Set up vertex array object with our buffers
	gl.bindVertexArray(sector[sectorID].vao);
	gl.bindBuffer(gl.ARRAY_BUFFER,sector[sectorID].buffers.position);
	gl.vertexAttribPointer(programInfoCube.attribLocations.voxelPosition,3,gl.INT,false,0,0);
	gl.enableVertexAttribArray(programInfoCube.attribLocations.voxelPosition);	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, sector[sectorID].buffers.color);
	gl.vertexAttribPointer(programInfoCube.attribLocations.voxelColor,3,gl.UNSIGNED_BYTE,false,0,0);
	gl.enableVertexAttribArray(programInfoCube.attribLocations.voxelColor);

	}
}


//Returns chunk of x,y,z position in block space
chunk_get =function(x,y,z){
	return([Math.floor(x/chunkXY),Math.floor(y/chunkXY),Math.floor(z/chunkZ)]);
}

//Returns sector x,y,z position in chunk space
sector_get =function(x,y,z){
	return([Math.floor(x/sectorXY),Math.floor(y/sectorXY),Math.floor(z/sectorZ)]);
}


draw_sector = function(x,y,z){
	
	//Get sectorID
	sectorID = return_sectorID(x,y,z);

	//Keep track of how big of an array we are going to need to fill this sector
	var posLen=0;
	var colLen=0;
	var chunkAdd=[];
	
	//Get chunks nearby and add to list
	for(xx=0;xx<sectorXY;xx++){
	for(yy=0;yy<sectorXY;yy++){
	for(zz=0;zz<sectorZ;zz++){
		var pos = [xx+sector[sectorID].coords[0]*sectorXY,yy+sector[sectorID].coords[1]*sectorXY,zz+sector[sectorID].coords[2]*sectorZ];
		var chunkID = return_chunkID(pos[0],pos[1],pos[2]);
		//If the chunk has been defined, and drawn.
		if(chunk_drawn(chunkID)==true){
			//Add lengths to the posLen and colLen and then add to list
			posLen+=chunk[chunkID].blockDraws.position.length;
			colLen+=chunk[chunkID].blockDraws.color.length;
			chunkAdd.push(chunkID);
		}
		
	}}}
		
			
		
	//Create empty arrays at the length we are going to need 	
	sector[sectorID].blockDraws.position = new Int32Array(posLen); 
	sector[sectorID].blockDraws.color = new Uint8Array(colLen); 
	//Set offsets
	var posOffset=0;
	var colOffset=0;
	
	//Loop through list
	for(var q=0; q<chunkAdd.length;q++){
		//Set positions 
		sector[sectorID].blockDraws.position.set(chunk[chunkAdd[q]].blockDraws.position,posOffset);
		posOffset+=chunk[chunkAdd[q]].blockDraws.position.length;
		//Set colors
		sector[sectorID].blockDraws.color.set(chunk[chunkAdd[q]].blockDraws.color,colOffset);
		colOffset+=chunk[chunkAdd[q]].blockDraws.color.length;			
	}
	//Set size of the sector to how many verticies 
	sector[sectorID].buffers.size=(sector[sectorID].blockDraws.position.length/12)*6
	//Bind this sector VAO
	gl.bindVertexArray(sector[sectorID].vao);
	//Set data
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bindBuffer(gl.ARRAY_BUFFER, sector[sectorID].buffers.position);
	gl.bufferData(gl.ARRAY_BUFFER,sector[sectorID].blockDraws.position,gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, sector[sectorID].buffers.color);
	gl.bufferData(gl.ARRAY_BUFFER,sector[sectorID].blockDraws.color,gl.DYNAMIC_DRAW);
	

	//Clear working arrays now that the buffers are set
	sector[sectorID].blockDraws.position=0;
	sector[sectorID].blockDraws.color=0;
}



//Check if block exists
check_block = function(x,y,z){
	//get Chunk location
	var chunkRef = chunk_get(x,y,z);
	var chunkID = return_chunkID(chunkRef[0],chunkRef[1],chunkRef[2]);
	//get relative location in chunk
	var blockLoc = [x - (chunkRef[0]*chunkXY), y - (chunkRef[1]*chunkXY),z - (chunkRef[2]*chunkZ)]
	if(chunk[chunkID]==null){
		return(-1);
	}
	if(chunk[chunkID].blockList[blockLoc[0]+blockLoc[1]*chunkXY+blockLoc[2]*chunkXY*chunkXY]!=0){
		return(1)
		}else{
		return(-1);
	}
		
}
//Returns chunkID from x,y,z in block space
return_chunkID = function(x,y,z){
	return(x+y*chunkSpace+z*chunkSpace*chunkSpace);
}
//Returns sectorID from x,y,z in chunk space
return_sectorID = function(x,y,z){
	return(x+y*sectorSpace+z*sectorSpace*sectorSpace);
}

//Check if a sector exists and is drawn
chunk_drawn = function(chunkID){
	if(chunk[chunkID]!=null&&chunk[chunkID].blockDraws.position.length>0){
					return(true);
	}
	return(false);
}


//Give a little extra padding on sectors to not 
//be culled out of the view frustrum
var amountXY = -sectorXY*chunkXY*1.5;
var amountZ = -sectorZ*chunkZ*1.5



;
check_frustrum= function(point){
		
		//Position we are checking
		posVec = glMatrix.vec3.fromValues(point[0],point[1],point[2]);
	
		//If anything falls out of our view frustrum outside of padding
		if((-glMatrix.vec3.dot(leftN,posVec) - leftD)<amountXY ||  
		glMatrix.vec3.dot(rightN,posVec) + rightD<amountXY  || 
		(-glMatrix.vec3.dot(topN,posVec)+topD)<amountZ  ||  
		(glMatrix.vec3.dot(bottomN,posVec) + bottomD)<amountZ ||  
		(-glMatrix.vec3.dot(nearN,posVec) + nearD)<amountXY){
			return(0);
		}else{
			return(1);
		}
}


//Adds block data to buildBuffer
block_create = function(x,y,z,dontCull){
	
	cullWorker.postMessage({
		id : "block_create",
		coords : [x,y,z],
		dontCull : dontCull,
	});
	message_send([1,x,y,z]);
}

//Adds block data to deleteBuffer
block_delete = function(x,y,z){
	cullWorker.postMessage({
		id : "block_delete",
		coords : [x,y,z],
	});
	message_send([2,x,y,z]);
}



requestAnimationFrame(drawScene);

