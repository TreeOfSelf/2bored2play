/*
 ____  ____  __ _  ____  ____  ____ 
(  _ \(  __)(  ( \(    \(  __)(  _ \
 )   / ) _) /    / ) D ( ) _)  )   /
(__\_)(____)\_)__)(____/(____)(__\_)
All main drawing code 
*/
var subData=1;
//Definitions 
var screenSize=[0,0]
var prevSize=[-1,-1];

//List of sectors we are drawing + their distance to the camera 
var drawList=[];

//How many verts we are drawing
var drawLength=0;

//Wireframe toggle
var wireFrame=0;
//Orthographic toggle
var ortho = 0;
//Orthographic zoom
var orthoView=75.0;
//Field of view
var fov=45;

//Resolution scale
var resolution = 0.6;

//How far of a view to render
var viewDist = 7;
//How far down and up to render 
var zView = 2;


//Set resolution scale to pixelated
canvas.style.imageRendering='pixelated';


//Functions
window.loadImage = function(url, onload) {
	var img = new Image();
	img.src = url;
	img.onload = function() {
		onload(img);
	};
	return img;
};
gl.activeTexture(gl.TEXTURE0);
var playerTexture = gl.createTexture();
loadImage('./player.png', function(image){
var num=8;
var canvas2D = document.createElement('canvas');
canvas2D.width = 32
canvas2D.height = 32*num
var ctx = canvas2D.getContext('2d');
ctx.drawImage(image, 0, 0);
var imageData = ctx.getImageData(0, 0, 32, 32*num);
var pixels = new Uint8Array(imageData.data.buffer);
gl.bindTexture(gl.TEXTURE_2D_ARRAY, playerTexture);
gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D_ARRAY,gl.TEXTURE_WRAP_S,gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D_ARRAY,gl.TEXTURE_WRAP_T,gl.REPEAT);
gl.texImage3D(
	gl.TEXTURE_2D_ARRAY,
	0,
	gl.RGBA,
	32,
	32,
	num,
	0,
	gl.RGBA,
	gl.UNSIGNED_BYTE,
	pixels);
gl.generateMipmap(gl.TEXTURE_2D_ARRAY)
gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR)
});


//Drawing the scene


//Fps timing variables

//Things that don't need to be done every frame just once


//Depth testing
gl.enable(gl.DEPTH_TEST);

//Back face culling   
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
//No alpha blending          
gl.disable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
//Create drawing buffers


var indexBuffer = gl.createBuffer();

//Premade indice buffer
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
var indice=[];
for(var k=0;k<=99999;k++){
	var q=k*4;
	indice.push(q,q+1,q+2,q,q+2,q+3);
}
console.log("%c indice size: %c" + indice.length,"color:grey","color:red");
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(indice), gl.STATIC_DRAW)

//Background color
gl.clearColor(0.2, 0.0, 0.2, 1.0);  


//Building buffer for the block infront of you
blockBuildVao = gl.createVertexArray();
blockBuildPos = gl.createBuffer();
blockBuildCol = gl.createBuffer();


gl.bindVertexArray(blockBuildVao);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

gl.bindBuffer(gl.ARRAY_BUFFER,blockBuildPos);
gl.vertexAttribPointer(programInfoCube.attribLocations.voxelPosition,3,gl.INT,false,0,0);
gl.enableVertexAttribArray(programInfoCube.attribLocations.voxelPosition);	

gl.bindBuffer(gl.ARRAY_BUFFER,blockBuildCol);
gl.bufferData(gl.ARRAY_BUFFER,new Uint8Array([
90,90,90,
90,90,90,
90,90,90,
90,90,90,

150,150,150,
150,150,150,
150,150,150,
150,150,150,

50,50,50,
50,50,50,
50,50,50,
50,50,50,

110,110,110,
110,110,110,
110,110,110,
110,110,110,

170,170,170,
170,170,170,
170,170,170,
170,170,170,

210,210,210,
210,210,210,
210,210,210,
210,210,210,
]),gl.STATIC_DRAW);
gl.vertexAttribPointer(programInfoCube.attribLocations.voxelColor,3,gl.UNSIGNED_BYTE,false,0,0);
gl.enableVertexAttribArray(programInfoCube.attribLocations.voxelColor);




//FPS
let then = 0;
var fps=0;
var fpsReal;
var fpsTotal=0;
var fpsCount=0;
var deltaTime = 0;
drawLength = 0;

//Variables for the frustrum culling
zFar = 5000.0;
zNear = 0.0001;


//Current chunk
var camChunk = [0,0];

//Set view distance
function set_distance(viewDistt){
	viewDist=viewDistt;
}


//Main render
function drawScene(now) {
	if(camRotate[0]>6.283){
		camRotate[0]=0
	}
	if(camRotate[0]<0){
		camRotate[0]=6.283
	}
	/*if(camRotate[1]>6.283){
		camRotate[1]=0
	}
	if(camRotate[1]<0){
		camRotate[1]=6.283
	}*/
	//Time the renderer
	startTime = new Date();
	
	//Run player controls
	playerControl();

	
	//Set canvas size if it has changed
	if(window.innerWidth!=prevSize[0] || window.innerHeight!=prevSize[1]){
		
		
		//Set screen size
		prevSize = [window.innerWidth,window.innerHeight];
		screenSize = [Math.round(window.innerWidth*(resolution)),Math.round(window.innerHeight*(resolution))];
		canvas.width = screenSize[0];
		canvas.height = screenSize[1];
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		
		//Set frustrum culling variables
		
		//Near plane
		nearSize=[];
		nearSize[1]= 2 * Math.tan( (fov * Math.PI / 180) *0.64) * zNear; // Height
		nearSize[0]= nearSize[1] * (gl.canvas.clientWidth / gl.canvas.clientHeight) //Width
		
		//Far planes
		farSize=[];
		farSize[1]= 2 * Math.tan( (fov * Math.PI / 180) *0.64) * zFar; // Height
		farSize[0]= farSize[1] * (gl.canvas.clientWidth / gl.canvas.clientHeight) //Width
		//Up  vector
		up = glMatrix.vec3.fromValues(0,0,-1);
	
	}

	//Calculate FPS + delta Time
	now *= 0.001;deltaTime = now - then;  then = now; fps = 1 / deltaTime; 
	deltaTime =Math.min(deltaTime*100,20);fpsTotal+=fps;fpsCount+=1;
	//Average FPS
	if(fpsCount==60){fpsReal=fpsTotal/fpsCount;fpsTotal=0;fpsCount=0;}
	
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Create projection matrix
	projectionMatrix = glMatrix.mat4.create();

	//Perspective
	if(ortho==0){ 	
		gl.depthFunc(gl.LESS)
		gl.clearDepth(9999999); 	   		//     FOV                                       ASPECT                               NEAR FAR
		glMatrix.mat4.perspective(projectionMatrix,fov * Math.PI / 180,gl.canvas.clientWidth / gl.canvas.clientHeight,0.1,9999999999);

	//Orthographic
	}else{
		gl.depthFunc(gl.GREATER)
		gl.clearDepth(0); 
		glMatrix.mat4.ortho(projectionMatrix, -orthoView*(gl.canvas.clientWidth / gl.canvas.clientHeight),orthoView*(gl.canvas.clientWidth / gl.canvas.clientHeight),-orthoView,orthoView,99999,0.0001);
	}
	//Rotate Camera
	glMatrix.mat4.rotate(projectionMatrix,projectionMatrix,camRotate[1],[1,0,0]);
	glMatrix.mat4.rotate(projectionMatrix,projectionMatrix,camRotate[0],[0,1,0]);
	//Translate Camera
	glMatrix.mat4.translate(projectionMatrix,projectionMatrix,[-cam[0],cam[2]+camHeightChange,-cam[1]]);

	//Use cube shader and set uniforms
	gl.useProgram(programInfoCube.program);

	//Set uniforms
	gl.uniformMatrix4fv(programInfoCube.uniformLocations.projectionMatrix,false,projectionMatrix);
	gl.uniform3fv(programInfoCube.uniformLocations.cam,[cam[0],cam[1],cam[2]+camHeightChange]);
	gl.uniform1i(programInfoCube.uniformLocations.ortho,ortho);	
	
	//Get camera chunk and sector
	camChunk = chunk_get(cam[0],cam[1],cam[2]);	
	camSector = sector_get(camChunk[0],camChunk[1],camChunk[2]);


	//Reset drawLength and the drawList 
	drawLength=0;
	drawList=[];
	
	
	//Create frustrum for culling
	create_frustrum();
	
	//Loop through nearby sectors based on view distances
	for(var xCheck=-viewDist;xCheck<=viewDist;xCheck++){
	for(var yCheck=-viewDist;yCheck<=viewDist;yCheck++){
	for(var zCheck=-zView;zCheck<=zView;zCheck++){
		
		
		//Get coordinates of current sector
		sectorCoords =[ camSector[0]+xCheck, camSector[1]+yCheck,camSector[2]+zCheck];
		//Return ID for the sector
		var sectorID = return_sectorID(sectorCoords[0],sectorCoords[1],sectorCoords[2]);

		//If the sector exists
		if(sector[sectorID]!=null){
				
				//Redraw sector if it needs to be updated
				if(sector[sectorID].reDraw==1){
					sector[sectorID].reDraw=0;
					draw_sector(sectorCoords[0],sectorCoords[1],sectorCoords[2]);
				}
				
			//Get sector position in chunk space
			var sectorPos = [sector[sectorID].coords[0]*sectorXY,sector[sectorID].coords[1]*sectorXY,sector[sectorID].coords[2]*sectorZ];
			var sectorRef=sector[sectorID];
			
			//Dont frustrum cull in orthographic view 
			if(ortho==1){      //Sector ID      Distance from camera
				drawList.push([sectorID,distance(sectorCoords,camSector)]);
			}else{
				//Distance from camera
				var dist=distance(sectorCoords,camSector);
				
				//Don't cull out sectors that are super close
				if(/*dist <=1.0 ||*/
				//If sector is within view frustrum
					check_frustrum( [(sectorPos[0]*chunkXY)+chunkXY/2,(sectorPos[1]*chunkXY)+chunkXY/2,(sectorPos[2]*chunkZ)+(chunkZ)/2])==true || true){
				//Add sector to drawList
									//ID    distance to camera
					drawList.push([sectorID,dist]);	
				}

			}
		}
	}}}


	//Sort the draw list by distance 
	drawList.sort(function(a,b){
		return(a[1]-b[1]);
	});
	
	//Loop through view
	for(var i=0;i<drawList.length;i++){
			//Get sector reference from draw list
			var sectorRef = sector[drawList[i][0]];
			//If sector is drawn
			if (sectorRef.buffers.size!=0){
				//Add to draw length
				drawLength+=sectorRef.buffers.size;
				//Bind VAO
				gl.bindVertexArray(sectorRef.vao);
				//Draw
				if(wireFrame==0){
					gl.drawElements(gl.TRIANGLES, sectorRef.buffers.size,gl.UNSIGNED_INT,0);
				}else{
					gl.lineWidth(15.0);
					gl.drawElements(gl.LINES, sectorRef.buffers.size,gl.UNSIGNED_INT,0);				
						
				}
			}
		
	}
	
	//Draw block infront where you will build
	
	if(ortho==0){
		gl.bindVertexArray(blockBuildVao);
		gl.bindBuffer(gl.ARRAY_BUFFER, blockBuildPos);
		gl.bufferData(gl.ARRAY_BUFFER,buildArrayPos,gl.STATIC_DRAW);
		gl.depthFunc(gl.LEQUAL);
		gl.drawElements(gl.LINES, 36,gl.UNSIGNED_SHORT,0);	
	}	
	
	
	gl.bindVertexArray(entityVAO);
	//Use cube shader and set uniforms
	gl.useProgram(programInfoPixel.program);
	entity_buildBuffer();

	//Set uniforms
	gl.uniformMatrix4fv(programInfoPixel.uniformLocations.projectionMatrix,false,projectionMatrix);
	gl.uniform3fv(programInfoPixel.uniformLocations.cam,[cam[0],cam[1],cam[2]+camHeightChange]);
	gl.uniform1i(programInfoPixel.uniformLocations.ortho,ortho);		
	gl.uniform1i(programInfoPixel.uniformLocations.sampler,0);		
	gl.uniform2fv(programInfoPixel.uniformLocations.screenSize,[canvas.width,canvas.height]);
	gl.uniform1f(programInfoPixel.uniformLocations.zoom,orthoView);			
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D_ARRAY, playerTexture);

	gl.drawArrays(gl.POINTS,0,entityLength);
	
	//Send buffers 
	//buffers_send();
	
	//Check date now to find out ms pased
	endTime = new Date();
	endTime-=startTime;
	//Print ms if the timing is under 60fps
	if(endTime>16.2){
			console.log("%c Render took!: %c"+ endTime+'ms','color:red; font-weight:bold;','color:black; font-weight:bold;');
	}
	//Request to render next frame
	//message_send([0,cam[0].toFixed(2),cam[1].toFixed(2),cam[2].toFixed(2),camRotate[0].toFixed(2),camRotate[1].toFixed(2),solid]);
	requestAnimationFrame(drawScene);

}
function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}


