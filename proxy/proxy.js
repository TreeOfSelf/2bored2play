//Requires 
const save = "./saveid";
const fs = require('fs');
const { fork } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const mc = require('minecraft-protocol'); // to handle minecraft login session
const colors = require('colors');
const Vec3 = require('vec3');

//Definitions 

var secrets;
var finishedQueue = false;
var stoppedByPlayer = false;
var timedStart;
var lastQueuePlace;
var chunkData = new Map();
var totalWaitTime;
var options;
var config;
var mcData;
var proxyClient=[]; // a list of clients connected to the proxy 
var client=null; // the client that connects to the server
var server=null; // the minecraft server to pass packets
var webServer = null;
var mapProc;
var onGroundSet = false;

process.on('message',(msg) => {
	switch(msg.name){
		
		//Set configuration, account information, and start the proxy
		case "start":
			config = msg.config;
			secrets = msg.secrets;
			
			
			options = {
				host: config.proxy.host,
				port: parseInt(config.proxy.port),
				version: config.proxy.version
			}
			
			
			mcData = require('minecraft-data')(config.proxy.version)
			
			if(config.proxy.map==true){
				mapProc = fork(__dirname+'/mapProc.js');
			}
			start();
			
		break;
		case "spam":
			filterPacketAndSend({text : '/msg',assumeCommand: false, lookedAtBlock:{x:269,y:47,z:152}},{size:17, name:"tab_complete",state:'play'},client)
		break;
		case "onGround":
			onGroundSet=msg.set;
		break;
	}
});






// function to disconnect from the server
function stop() {
	process.send(['bot_end']);
	finishedQueue = false;
	client.end(); // disconnect
	if (proxyClient.length>0) {
		proxyEnd("Stopped the proxy."); // boot the player from the server
	}
	if(server!=null){
		server.close(); // close the server
	}
}



//Handling of proxies, these functions will effect every currently connected proxyClient

function proxyEnd(reason){
	for(var k =0;k<proxyClient.length;k++){
		proxyClient[k].end(reason);
	}
}

function proxyWrite(meta,data){
	for(var k =0;k<proxyClient.length;k++){
		proxyClient[k].write(meta,data);
	}	
}


// function to start the whole thing
function start() {
	

	
	yourEntityId = 0;
	entities={};
	playerInfo=[];
	packetSend=[];
	packetList={};
	mapPackets = {};
	multiBlockChange = {};


	if(webServer==null && false){
		webServer = http.createServer(function (req, res) {
		  fs.readFile(__dirname+'/packet/' + req.url, function (err,data) {
			if (err) {
			  res.writeHead(404);
			  res.end(JSON.stringify(err));
			  return;
			}
			res.writeHead(200, {  
				'Content-Type': 'text/html'  
			});  
			res.write(data);
			res.end();
		  });
		}).listen(4269);
		
		console.log("Packet debug started at http://127.0.0.1:4269/index.html".cyan);

		const wsServer = new WebSocket.Server({
			server : webServer
		});
		packetListBK={};
		packetSendBK=[];

		wsServer.on('connection', function(connection) {
			process.send(['bot_end']);
;
				connection.on('message', function(message) {
					message = JSON.parse(message);
					
					switch(message[0]){
						case "run_code":
							connection.send(JSON.stringify(['ran_code',global.webEval(message[1])]));
						break;
						case "once":
							connection.send(JSON.stringify(['once',JSON.stringify(packetList)]));			
						break;
						case "list":
							connection.send(JSON.stringify(['list',JSON.stringify(packetSend)]));						
						break;
						case "listPacket":
							packetList[message[1]]=message[2];
						break;
						case "sendPacket":
							packetSend[message[3]]=[message[1],message[2]];
						break;
						case "deleteOnce":
							delete packetList[message[1]];
						break;
						case "deleteSend":
							packetSend.splice(message[1],1);
						break;
						case "newOnce":
							packetList = message[1];
						break;
						case "newSend":
							packetSend = message[1];
						break;
						case "backup":
							packetListBK = {...packetList};
							packetSendBK = [...packetSend]
						break;
						case "restore":
							if(packetListBK != null){
								packetList = {...packetListBK};
								packetSend = [...packetSendBK]
							}
						break;
					}
				   
				});

		});

	}
	
	console.log(('Proxy is joining server: '+config.proxy.host+':'+config.proxy.port).brightGreen);
	
	options = {
	host: config.proxy.host,
	port: parseInt(config.proxy.port),
	username: secrets.username,
	auth : secrets.auth,
	authTitle : secrets.auth,
	password: secrets.password,
	}
	
	
	if (config.proxy.onlineMode) {
		
		client = mc.createClient(options);
		join();
		

	} else {
		console.log('Joining in offline mode!'.red);
		options.username = config.proxy.username;
		client = mc.createClient(options); 
		join();
	}
}


dimension=null;

yourEntityId = 0;

entities={};

playerInfo=[];

packetSend=[];

packetList={};

mapPackets = {};

multiBlockChange = {};

const emptyItem = {
	  blockId: -1,
	  itemCount: undefined,
	  itemDamage: undefined,
	  nbtData: undefined
};


filterArray = function (array, condition,data){
	let list = [];
	for(var v= 0 ; v<array.length; v++){
		if(condition(array[v]) == true){
				list.push(array.splice(v,1));
				v--;
		}	
	}
	return(list);
}



function packet_add(name,data){
	packetSend.push([name,data]);
}

function packet_once(name,data){
	packetList[name] = data;
}

function map_add(data){
	if(mapPackets[data.x+'_'+data.z]==null){
	mapPackets[data.x+'_'+data.z]=data;		
	}

}

function map_remove(data){
	delete mapPackets[data.chunkX+'_'+data.chunkZ];
}


//Filter packets 
curPos=null;

packetNum=0;

var unloadDist = 400;

checkInterval = setInterval(function(){
	

	if(curPos!=null){
	let packet = packetSend[packetNum];
	
	if(packet!=null){
	switch(packet[0]){

		case "map_chunk":
			var dist = Math.abs(packet[1].x*16 - curPos.x) + Math.abs(packet[1].z*16 - curPos.z);
			if(dist>unloadDist){
				packetSend.splice(packetNum,1);
			}
		break;
		case "update_light":
			var dist = Math.abs(packet[1].chunkX*16 - curPos.x) + Math.abs(packet[1].chunkZ*16 - curPos.z);
			if(dist>unloadDist){
				packetSend.splice(packetNum,1);
			}
		break;
		case "block_change":
			var dist = Math.abs(packet[1].location.x - curPos.x) + Math.abs(packet[1].location.z - curPos.z);
			if(dist>unloadDist){
				packetSend.splice(packetNum,1);
			}
		break;
		case "multi_block_change":
		
			var dist = Math.abs(packet[1].chunkCoordinates.x*16 - curPos.x) + Math.abs(packet[1].chunkCoordinates.z*16 - curPos.z);
			if(dist>unloadDist){
				packetSend.splice(packetNum,1);
			}
		break;
		case "unload_chunk":
			var dist = Math.abs(packet[1].chunkX*16 - curPos.x) + Math.abs(packet[1].chunkZ*16 - curPos.z);
			if(dist>unloadDist){
				packetSend.splice(packetNum,1);
			}				
		break;
		case "block_change":
			var dist = Math.abs(packet[1].location.x - curPos.x) + Math.abs(packet[1].location.z - curPos.z);
			if(dist>unloadDist){
				packetSend.splice(packetNum,1);
			}				
		break;
		case "spawn_entity":
			if(entities[packet[1].entityId]==null){
				filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
			}
		break;
		case "spawn_entity_living":
			var del = false;
		
			var dist = Math.abs(packet[1].x - curPos.x) + Math.abs(packet[1].z - curPos.z);
			if(dist>unloadDist){
				del=true;
			}
		
			if(entities[packet[1].entityId]==null || del){
				filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
			}
		break;

		case "named_entity_spawn":
			if(entities[packet[1].entityId]==null){
				filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
			}
		break;
		case "entity_metadata":
			if(entities[packet[1].entityId]==null){
				filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);					
			}
		break;
		case "entity_update_attributes":
			if(entities[packet[1].entityId]==null){
				filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);				
			}
		break;
		case "entity_status":
			if(entities[packet[1].entityId]==null){
				filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);				
			}
		break;
		case "set_passengers":
			if(entities[packet[1].entityId]==null){
				filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);			
			}
		break;

	
	}
	}

	
	for(entityId in entities){
		let entity = entities[entityId];
		var dist = Math.abs(entity.x - curPos.x) + Math.abs(entity.z - curPos.z);
		if(dist>unloadDist){
			filterArray(packetSend,packet => packet[1].entityId == entityId);
			delete entities[entityId];
		}
	}

	for(property in multiBlockChange){
		let chunkData = multiBlockChange[property];
		var dist = Math.abs(chunkData.chunkX*16 - curPos.x) + Math.abs(chunkData.chunkZ*16 - curPos.z);
		if(dist>unloadDist){
			delete multiBlockChange[property];
		}
	}
	

	packetNum+=1;
	if(packetNum>=packetSend.length){
		packetNum=0;
	}
	}

},20);

type='bot';
entities = {};

//respawnPacket=null;

canStack=0;
saveItem=null;

windowItems = {
	
}


function join() {
	let ETAhour;
	let timepassed;
	client.on("packet", (data, meta) => { // each time we get a packet from the server the proxy is hooked into
		send=true;
		switch (meta.name) {
			default:
				console.log(meta.name);
			break;
			case "close_window":
				send=false;
			break;
			case "chat":
				
				let text = JSON.parse(data.message).text;
				let sender = JSON.parse(data.message).sender;
				if(text!="" && text!=null){
					let newText ="";
					for(var k=0;k<text.length;k++){
						if(text[k]!='§' && text[k-1] != '§'){
							newText+=text[k];
						}
					}
			
					console.log("<SERVER> "+newText);
					
				}else{
					let msg = JSON.parse(data.message);
					if(msg.extra!=null){
						let newText = "";
						for(var k=0;k<msg.extra.length;k++){
							let text = msg.extra[k].text;
							newText+=text;
							
						}
						console.log(newText);
					}
				}
				
			break;
			case "declare_commands":
				packet_add(meta.name,data);		
			break;
			case "abilities":
				packet_add(meta.name,data);		
			break;
			case "unlock_recipes":
				packet_add(meta.name,data);		
			break;
			case "declare_recipes":
				packet_add(meta.name,data);		
			break;
			case "tags":
				packet_add(meta.name,data);		
			break;
			case "difficulty":
				packet_add(meta.name,data);		
			break;
			case "spawn_position":
				packet_add(meta.name,data);		
			break;
			case "world_event":
		//		packet_once(meta.name,data);		
			break;
			case "advancements":
				packet_add(meta.name,data);		
			break;
			case "clear_titles":
				packet_add(meta.name,data);
			break;
			case "initialize_world_border":
				packet_add(meta.name,data);			
			break;
			case "spawn_entity_painting":
				packet_add(meta.name,data);
			break;
			case "vehicle_move":
				//packet_add(meta.name,data);
			break;
			case "boss_bar":
				packet_add(meta.name,data);
			break;
			case "window_items":
	
				windowItems[data.windowId] = data;
			packet_once(meta.name,data);

			break;

			case "collect":
			filterArray(packetSend,packet => packet[1].entityId == data.collectedEntityId);
			
			delete entities[data.collectedEntityId];
			break;
			case "enter_combat_event":
			//	packet_once(meta.name,data);		
			break;
			case "acknowledge_player_digging":
				//packet_once(meta.name,data);		
			break;
			case "end_combat_event":
			//	packet_once(meta.name,data);		
			break;
			case "block_break_animation":
			//packet_once(meta.name,data);
			break;
			case "tile_entity_data":
			packet_add(meta.name,data);
			break;
			case "update_time":
				packet_once(meta.name,data);
			break;
			case "held_item_slot":

				packet_once(meta.name,data);
			case "spawn_entity_weather":
			//packet_add(meta.name,data);
			break;

			case "craft_progress_bar":
			//packet_add(meta.name,data);
			break;
			case "named_entity_spawn":
				packet_add(meta.name,data);
				entities[data.entityId]=data;
			break;
			case "spawn_entity":
				packet_add(meta.name,data);
				entities[data.entityId]=data;
			break;
			case "spawn_entity_living":
				packet_add(meta.name,data);		
				entities[data.entityId]=data;				
			break;
			case "entity_status":
				

				//packet_add(meta.name,data);

			break;
			case "entity_metadata":
				packet_add(meta.name,data);
			break;
			case "entity_teleport":
			if(entities[data.entityId]!=null){
				entities[data.entityId].x= data.x;
				entities[data.entityId].y= data.y;
				entities[data.entityId].z= data.z;				
			}			
			
			for(var k =0;k<packetSend.length;k++){
				if(packetSend[k][1].entityId == data.entityId && packetSend[k][1].x!=null){
					packetSend[k][1].x = data.x;
					packetSend[k][1].y = data.y;
					packetSend[k][1].z = data.z;
				}
			}
			
			//packet_add(meta.name,data);
			break;
			case "entity_destroy":
				for(var k =0;k<data.entityIds.length;k++){
					const entityId = data.entityIds[k];
					filterArray(packetSend,packet => packet[1].entityId == entityId);
					delete entities[entityId];
				}
				//packet_add(meta.name,data);
			break;
			case "entity_equipment":
				packet_add(meta.name,data);
			break;
			case "player_info":
				//See if perhaps, we can sort through our entities list, see if we have a match for the UUID and if not delete the player_info packet
				let add = 1;
				for(var k =0;k<playerInfo.length;k++){
					if(playerInfo[k].data[0].name == data.data[0].name){
					playerInfo[k] = data;
					add=0;
					k=playerInfo.length;
					}
				}
				if(data.data[0]!=null && data.data[0].name!=null && add==1){
					playerInfo.push(data);
				}
				packet_add(meta.name,data);
			break;
			case "set_slot":
			packet_once(meta.name,data);
			break;
			case "position":
				curPos = data;
				//packet_once(meta.name,data);
				packetList.position = curPos;
			break;
			case "map_chunk":

				packet_add(meta.name,data);
				if(mapProc!=null){
					mapProc.send({name:'map_chunk',packet :data,dimension: dimension});
				}
				break;
			case "unload_chunk":
			filterArray(packetSend,packet => packet[0] == 'map_chunk' && packet[1].x == data.chunkX && packet[1].z == data.chunkZ,data);

				break;

			case "playerlist_header":

				packet_once(meta.name,data);
				break;

			case "respawn":

				entities=[];	
				packetList.login.dimension = data.dimension;
				packetList.login.levelType = data.levelType;
				packetList.login.gameMode = 0;
				dimension=data.dimension;
		
				break;
			case "login":
				
				console.log('Connected!'.cyan);
				yourEntityId = data.entityId;
				
				client.write('client_command', { payload: 0 })
				packet_once(meta.name,data);
				if(server==null){
					createServer(client.version);
				}
				
				
				if(mapProc!=null){
					mapProc.send({ name : 'dimension'})
				}
							process.send(['bot_restart']);
				
				
				for(var k =0; k<packetSend.length;k++){
					if(packetSend[k][0]=='login'){
						packetSend[k][1].gameMode = data.gamemode;
						packetSend[k][1].dimension = data.dimension;
						packetSend[k][1].levelType = data.levelType;
					}
				}	
				dimension=data.dimension;
	
				break;
			case "game_state_change":
		//		packet_once(meta.name,data);
			break;
			case "block_action":
				//packet_add(meta.name,data);
			break;
			case "entity_head_rotation":
			
			break;
			case "entity_velocity":
		
			break;
			case "entity_move_look":
			
			if(entities[data.entityId]!=null){
				entities[data.entityId].x+= data.dX/128/64;
				entities[data.entityId].y+= data.dY/128/64;
				entities[data.entityId].z+= data.dZ/128/64;	
				entities[data.entityId].pitch = data.pitch;
				entities[data.entityId].yaw = data.yaw;
			}			
			
			for(var k =0;k<packetSend.length;k++){
				if(packetSend[k][1].entityId == data.entityId && packetSend[k][1].x!=null){
					packetSend[k][1].x += data.dX/128/64;
					packetSend[k][1].y += data.dY/128/64;
					packetSend[k][1].z += data.dZ/128/64;
					packetSend[k][1].pitch = data.pitch;
					packetSend[k][1].yaw = data.yaw;
				}
			}	
	
			break;
			case  "entity_update_attributes":
		
			break;
			case "rel_entity_move":
			

			if(entities[data.entityId]!=null){
				entities[data.entityId].x+= data.dX/128/64;
				entities[data.entityId].y+= data.dY/128/64;
				entities[data.entityId].z+= data.dZ/128/64;				
			}			
			
			

			
			for(var k =0;k<packetSend.length;k++){
				if(packetSend[k][1].entityId == data.entityId && packetSend[k][1].x!=null){
					packetSend[k][1].x += data.dX/128/64;
					packetSend[k][1].y += data.dY/128/64;
					packetSend[k][1].z += data.dZ/128/64;
				}
			}	
			
			break;
			case "experience":
				packet_once(meta.name,data);	
			break;
			case "update_health":
				packet_once(meta.name,data);	
			break;
			case "block_change":

				filterArray(packetSend,packet => packet[0] == 'block_change' && packet[1].location.x == data.location.x &&
				packet[1].location.y == data.location.y &&
				packet[1].location.z == data.location.z);
			
				packet_add(meta.name,data);
			break;
			case "multi_block_change":

				/*let chunkId = data.chunkX+'_'+data.chunkZ;
				if(multiBlockChange[chunkId]==null){
					multiBlockChange[chunkId] = {
						chunkX : data.chunkX,
						chunkZ : data.chunkZ,
						records : [],
					};
				}
				
				for(var k =0; k<data.records.length;k++){
					let enterData = multiBlockChange[chunkId].records.find(bData => bData.horizontalPos == data.horizontalPos && bData.y == data.y);
					if(enterData==null){
						multiBlockChange[chunkId].records.push(data.records[k]);
					}else{
						multiBlockChange[chunkId].records[k] = data.records[k];
					}
				}*/
				

				
		
				packet_add(meta.name,data);
				
				
			
			break;
			case "keep_alive":
			
			break;
			case "entity_look":

			if(entities[data.entityId]!=null){

				entities[data.entityId].pitch = data.pitch;
				entities[data.entityId].yaw = data.yaw;
			}			
			
			for(var k =0;k<packetSend.length;k++){
				if(packetSend[k][1].entityId == data.entityId && packetSend[k][1].x!=null){
					packetSend[k][1].pitch = data.pitch;
					packetSend[k][1].yaw = data.yaw;
				}
			}	
			//packet_add(meta.name,data);
			break;
			case "sound_effect":
				//packet_once(meta.name,data);
			break;
			case "tab_complete":
				//console.log(meta.name);
			break;
			case "animation":
				//packet_add(meta.name,data);			
			break;
	
			case "world_particles":
				//packet_once(meta.name,data);
			break;
			case "teams":
				packet_once(meta.name,data);
			break;
			case "scoreboard_objective":
				packet_once(meta.name,data);
			break;
			case "scoreboard_display_objective":
				packet_once(meta.name,data);
			break;
			case "title":
				packet_once(meta.name,data);
			break;
			case "scoreboard_score":
				packet_once(meta.name,data);
			break;
			case "statistics":
				packet_once(meta.name,data);
			break;
			case "entity_effect":
				//packet_once(meta.name,data);
			break;
			case "set_passengers":
				filterArray(packetSend,packet => packet[0] == 'set_passengers' && packet[1].entityId == data.entityId);
				packet_add(meta.name,data);
			break;
			case "named_sound_effect":
				packet_once(meta.name,data);
			break;
			case "update_view_position":
				packet_once(meta.name,data);
			break;
			case "update_view_distance":
				packet_once(meta.name,data);
			break;
			case "update_light":
				packet_add(meta.name,data);
			break;
			case "map":
				packet_add(meta.name,data);
			break;
		}
		if (proxyClient.length>0 && send==true) { // if we are connected to the proxy, forward the packet we recieved to our game.
			filterPacketAndSend(data, meta,proxyClient);
		}
	});

	// set up actions in case we get disconnected.
	client.on('end', (err) => {
		process.send(['bot_end']);
		console.log(err);
		if (proxyClient.length>0) {
			proxyEnd("Connection reset.\nReconnecting...");
			proxyClient = [];
		}
		stop();
		console.log("Connection reset . Reconnecting...");
		setTimeout(reconnect, 30000);
	});

	client.on('error', (err) => {
		process.send(['bot_end']);
		if (proxyClient.length!=0) {
			proxyEnd(`Connection error\n Error message: ${err}\nReconnecting...`);
			proxyClient = [];
		}
		stop();
		console.log(`Connection error  Error message: ${err} Reconnecting...`);
		if (err == "Error: Invalid credentials. Invalid username or password.") setTimeout(reconnect, 60000);
		else setTimeout(reconnect, 4000);
		
	});
	function createServer(version){
	server = mc.createServer({ // create a server for us to connect to
		'online-mode': false,
		encryption: false,
		host: '0.0.0.0',
		port: config.proxy.hostPort,
		version: version,
		'max-players': maxPlayers = 3
	});

	server.on('login', (newProxyClient) => { // handle login



		/*for(var k =0;k<playerInfo.length;k++){
			newProxyClient.write('player_info',playerInfo[k]);
		}*/
	
		for(property in packetList){
			newProxyClient.write(property,packetList[property]);
		}
		
		for(var k=0; k<packetSend.length; k++){
			newProxyClient.write(packetSend[k][0],packetSend[k][1]);
		}
		

		if(curPos!=null){
		//console.log("CUR POS:");
		//console.log(curPos);
		//curPos.teleportId=1;
		packetList.position = curPos;
		}else{
			packetList.position={
				x: 0,
				y: 1.62,
				z: 0,
				yaw: 0,
				pitch: 0,
				flags: 0x00		
			}
		}
		
		


		
		
		/*for(window in windowItems){
			newProxyClient.write('window_items',windowItems[window]);
		}*/
		
		
		/*for(property in multiBlockChange){
			newProxyClient.write('multi_block_change',multiBlockChange[property]);
		}*/
		
		var packetCount=0;
		
		//Delete this from our connection list when they leave
		newProxyClient.on('end', function(){
			

			if(proxyClient.length==1){
				process.send(['bot_restart']);
			}
			proxyClient.splice(proxyClient.indexOf(newProxyClient),1);
			
			


			
		});
		
		
		
		newProxyClient.on('packet', (data, meta) => { // Redirect packets from users connected to proxy to the server the proxy is connected to
			if(proxyClient.indexOf(newProxyClient)==proxyClient.length-1 ){
			let send = true;
			switch(meta.name){
				case "held_item_slot":
				if(packetList['held_item_slot']!=null){
					packetList['held_item_slot']=data.slotId;
				}
				break;
				case "displayed_recipe":
					send=null;
				break;
				case "recipe_book":
					send=null;
				break;
				case "position":
					if(curPos!=null){
						curPos.x = data.x;
						curPos.y = data.y;
						curPos.z = data.z;
						packetList.position = curPos;
	
					}
					//data.onGround=onGroundSet;
					
				break;

				case "position_look":
					if(curPos!=null){
					curPos.x = data.x;
					curPos.y = data.y;
					curPos.z = data.z;
					curPos.pitch = data.pitch;
					curPos.yaw = data.yaw;
					packetList.position = curPos;
					
					}
					//data.onGround=onGroundSet;
				break;
				case "look":
					if(curPos!=null){
					curPos.pitch = data.pitch;
					curPos.yaw = data.yaw;
					packetList.position = curPos;
					
					}
				//data.onGround=onGroundSet;
				break;
			}
			
			
			
	
			if(send) filterPacketAndSend(data, meta, client);
		
			}
		});
		
		if(proxyClient.length>=1){
			process.send(['bot_end']);
			type='user';
		}
		
		proxyClient.push(newProxyClient);
	});
	}
}




function reconnect() {
	if (stoppedByPlayer) stoppedByPlayer = false;
	else {
		console.log("Reconnecting... ");
		reconnectLoop();
	}
}

function reconnectLoop() {
	start();
}

//function to filter out some packets that would make us disconnect otherwise.
//this is where you could filter out packets with sign data to prevent chunk bans.
 filterPacketAndSend = function(data, meta, dest) {
	if (meta.name !== "keep_alive" /*&& meta.name !== "update_time"*/) { //keep alive packets are handled by the client we created, so if we were to forward them, the minecraft client would respond too and the server would kick us for responding twice.
		if(Array.isArray(dest)==false){
			dest.write(meta.name, data);
		}else{
			for(var k=0; k<dest.length;k++){
				dest[k].write(meta.name, data);
			}
		}
	}
}

function round(number) {
	if (number > 0) return Math.ceil(number);
	else return Math.floor(number);
}



function stopQueing() {
	stoppedByPlayer = true;
	stop();
}


module.exports = {
	start: function () {
		start();
	},
	filterPacketAndSend: function () {
		filterPacketAndSend();
	},
	stop: function () {
		stopQueing();
	},
	printChunks : function(){
		return(chunkData);
	},
	returnServer : function(){
		return(server);
	},
	returnClient : function(){
		return(client);
	},
	returnProxyClient : function(){
		return(proxyClient);
	},
	evalString : function(input){
		return(eval(input));
	},
	gameModeFix : function(){
		proxyWrite('game_state_change', { reason: 3, gameMode: 0 });
	},
	attemptRespawn : function(){
		client.write('client_command', { payload: 0 });
	}
};
