const version = '1.12'
const nbt = require('prismarine-nbt')
const Block = require('prismarine-block')(version)
const Chunk = require('prismarine-chunk')(version)
const ChatMessage = require('prismarine-chat')(version)
const World = require('prismarine-world')(version)
const Vec3 = require('vec3')
const WebSocket = require('ws');
const fs = require('fs');
const ini = require('ini');

//These are global because they may need to be accessed often by other modules 
global.config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
mcColor=null;
const ws = new WebSocket('ws://'+config.map.host+':'+config.map.port);
var world=null;



process.on('message', (msg) => {

  switch(msg.name){
	  case "dimension":
	    world = new World(null).sync
		mcColor = require(__dirname+'/colors.js');
	  break;
	  case "map_chunk":
		let packet = msg.packet;
		packet.chunkData =  Buffer.from(packet.chunkData.data);
		 addColumn({
		  x: packet.x,
		  z: packet.z,
		  bitMap: packet.bitMap,
		  heightmaps: packet.heightmaps,
		  biomes: packet.biomes,
		  skyLightSent: msg.dimension === 0,
		  groundUp: packet.groundUp,
		  data: packet.chunkData,
		  dimension : msg.dimension,
		})
	  break;

  }
});


var pushCoords=[];
var chunkProcess=[];
var chunkProcessing=false;

//colorChannelA and colorChannelB are ints ranging from 0 to 255
function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
    var channelA = colorChannelA*amountToMix;
    var channelB = colorChannelB*(1-amountToMix);
    return parseInt(channelA+channelB);
}
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
function colorMixer(rgbA, rgbB, amountToMix){
    var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
    var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
    var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
    return ([r,g,b]);
}

function addData(x,y,data){
	delColumn(data[0],data[1]);

	if(pushCoords[x+'_'+y]==null){
		pushCoords[x+'_'+y]=[data]
	}else{
		pushCoords[x+'_'+y].push(data);
	}
}

addMapData = setInterval(function(){
	for(var mapCoords in pushCoords){

			processChunkIntoString(mapCoords,{});		
		
		break;
		return;
	}
},1000);


function processChunkIntoString(mapCoords,mapData){
	var chunksAdded=0;
	let addData = pushCoords[mapCoords];
	for(var k=0; k<addData.length;k++){
		let chunk = addData[k];
		ws.send(JSON.stringify(['raster',chunk[0]+'_'+chunk[1],chunk[2].toString(),mapCoords,chunk[3].toString()]));
	}
;
	delete pushCoords[mapCoords];
}

processChunks = setInterval(function(){
	if(chunkProcessing==false && chunkProcess.length>0){
		let chunk = chunkProcess.shift();

		chunkProcessing=true;
		getTopLayer(chunk[0],0,256,0,[],0,null,chunk[1]);
	}
},500);




function delColumn (chunkX, chunkZ) {
	const columnCorner = new Vec3(chunkX * 16, 0, chunkZ * 16)
	world.unloadColumn(chunkX, chunkZ)
}

function addColumn (args) {

	var columnCorner = new Vec3(args.x * 16, 0, args.z * 16)
	if (!args.bitMap) {
	  // stop storing the chunk column
	  delColumn(args.x, args.z)
	  return
	}
	let column = world.getColumn(args.x, args.z)
	if (!column) {
	  column = new Chunk()
	  world.setColumn(args.x, args.z, column)
	}

	try {
	  column.load(args.data, args.bitMap, args.skyLightSent, args.groundUp)
	  if (args.biomes !== undefined) {

		column.loadBiomes(args.biomes)
	  }
	} catch (e) {
		
	}
	
	chunkProcess.push([columnCorner,args.dimension]);

}


function getTopLayer(point,x,y,z,list,waterCheck=0,waterMix=null,dimension){

	if(waterCheck==1){
	
		world.async.getBlock(point.offset(x,y,z)).then(function(blockUnder){

			if(blockUnder.name.search('water')==-1 && blockUnder.name.search('lava')==-1 && blockUnder.name.search('ice')==-1){
				getTopLayer(point,x,y,z,list,2,blockUnder.type,dimension);
			}else{
				y-=1;
				getTopLayer(point,x,y,z,list,1,null,dimension);
			}
		});


	}else{
	
	let ySet = y;
	if(waterCheck==2){
		ySet+=1;
	}
	let block = world.async.getBlock(point.offset(x,ySet,z)).then(function(block){

		if(block.name!='air' && (block.boundingBox=='block' || block.name.search('water')!=-1 || block.name.search('lava')!=-1) 
		&& (block.name!='bedrock' || ySet<20)
		&& ( (block.name!='netherrack' && block.name!='glowstone' && block.type!=153) || dimension!=-1 || (world.getBlock(point.offset(x,ySet+1,z)).name=='air' && world.getBlock(point.offset(x,ySet+2,z)).name=='air') )
		){
			let ySet=y;
			let color = mcColor(block.type,ySet)

			//Water depth
			
			if( ( (block.name.search('water')!=-1 || block.name.search('lava')!=-1) || block.name.search('ice')!=-1 )&& block.type!=111){
				if(waterCheck!=2){
					getTopLayer(point,x,y,z,list,1,null,dimension);
					return;
				}else{
					if(Math.random()<=0.5){
						color = colorMixer([255,255,255],color,Math.random()*0.01);
					}else{
						color = colorMixer([0,0,0],color,Math.random()*0.01);						
					}
				}
			}else 

			if( block.name.search('snow')==-1){

				if(Math.random()<=0.5){
					color = colorMixer([255,255,255],color,Math.random()*0.005);
				}else{
					color = colorMixer([0,0,0],color,Math.random()*0.005);						
				}
				
			}else{
				if(Math.random()<=0.5){
					color = colorMixer([255,255,255],color,Math.random()*0.01);
				}else{
					color = colorMixer([0,0,0],color,Math.random()*0.01);						
				}				
			}
			
			if(waterMix!=null){
				color = colorMixer(color, mcColor(waterMix,ySet),0.7);
			}
		

			if(block.displayName.toLowerCase().search('green')!=-1){
				color = colorMixer(color,[0,128,0],0.5);
			}
			if(block.displayName.toLowerCase().search('lime')!=-1){
				color = colorMixer(color,[0,202,0],0.5);
			}
			if(block.displayName.toLowerCase().search('orange')!=-1){
				color = colorMixer(color,[237,135,0],0.5);
			}
			if(block.displayName.toLowerCase().search('magenta')!=-1){
				color = colorMixer(color,[200,0,162],0.5);
			}
			if(block.displayName.toLowerCase().search('light blue')!=-1){
				color = colorMixer(color,[0,255,255],0.5);
			}
			if(block.displayName.toLowerCase().search('yellow')!=-1){
				color = colorMixer(color,[255,255,0],0.5);
			}			
			if(block.displayName.toLowerCase().search('pink')!=-1){
				color = colorMixer(color,[255,2,255],0.5);
			}	
			if(block.displayName.toLowerCase().search('light gray')!=-1){
				color = colorMixer(color,[220,220,220],0.5);
			}else{
				if(block.displayName.toLowerCase().search('gray')!=-1){
				color = colorMixer(color,[150,150,150],0.5);
				}
			}
			if(block.displayName.toLowerCase().search('cyan')!=-1){
				color = colorMixer(color,[62,128,182],0.5);
			}
			if(block.displayName.toLowerCase().search('purple')!=-1){
				color = colorMixer(color,[129,0,162],0.5);
			}
			if(block.displayName.toLowerCase().search('blue')!=-1){
				color = colorMixer(color,[0,0,255],0.5);
			}
			if(block.displayName.toLowerCase().search('brown')!=-1){
				color = colorMixer(color,[115,81,59],0.5);
			}
			if(block.displayName.toLowerCase().search('red')!=-1){
				color = colorMixer(color,[200,0,0],0.5);
			}
			if(block.displayName.toLowerCase().search('black')!=-1){
				color = colorMixer(color,[0,0,0],0.3);
			}



			list.push(color[0],color[1],color[2]);
			x+=1;
			y=256;
			if(x>15){
				x=0;
				z+=1;
				y=256;
			}
		}else{
			y-=1;
			if(y<0){

				x+=1;
				y=256;
				if(x>15){
					x=0;
					z+=1;
					y=256;
				}				
			}
		}
		if(z<=15){
				getTopLayer(point,x,y,z,list,0,null,dimension);
		}else{
			chunkProcessing=false;
			let majorCoords = [Math.floor(point.x/1600),Math.floor(point.z/1600)];
			let minorCoords = [Math.floor(point.x/16),Math.floor(point.z/16)];
			
			addData(majorCoords[0],majorCoords[1],[minorCoords[0],minorCoords[1],new Uint8Array(list),dimension]);

		}
	}).catch(function(e){
		chunkProcessing=false;
		
		if(chunkProcessing==false && chunkProcess.length>0){
			let chunk = chunkProcess.shift();
			chunkProcessing=true;

			getTopLayer(chunk[0],0,256,0,[],0,null,chunk[1]);
		}
			
			
		
	});
	}
	
}

