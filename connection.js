// imports
const jsonminify = require("node-json-minify"); // to remove comments from the config.json, because normally comments in json are not allowed
const fs = require('fs');
const mc = require('minecraft-protocol'); // to handle minecraft login session
const opn = require('open'); //to open a browser window
var config = JSON.parse(jsonminify(fs.readFileSync("./config.json", "utf8"))); // read the config
const {DateTime} = require("luxon");
const https = require("https");
const tokens = require('prismarine-tokens-fixed');
const save = "./saveid";
var mc_username;
var mc_password;
var secrets;
let finishedQueue = !config.minecraftserver.is2b2t;
const Entity = require('prismarine-entity')
const http = require('http');
const WebSocketServer = require('websocket').server;

const webServer = http.createServer(function (req, res) {
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


const wsServer = new WebSocketServer({
    httpServer: webServer,
    autoAcceptConnections: false,
	maxPayload : 999999999,
	maxReceivedFrameSize: 131055572,
	maxReceivedMessageSize: 10 * 1025554 * 1024,
	autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    
    var connection = request.accept('packet', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
		message = JSON.parse(message.utf8Data);
		
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
				console.log(message);
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
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});


fs.accessSync("./secrets.json", fs.constants.R_OK);
secrets = require('./secrets.json');
mc_username = secrets.username;
mc_password = secrets.password;


var stoppedByPlayer = false;
var timedStart;
var lastQueuePlace;
chunkData = new Map();
var loginpacket;
var totalWaitTime;
var starttimestring;
var playTime;
var options;
var doing;
let interval = {};



// lets
proxyClient=null; // a reference to the client that is the actual minecraft game
client=null; // the client to connect to 2b2t
server=null; // the minecraft server to pass packets

options = {
	host: config.minecraftserver.hostname,
	port: config.minecraftserver.port,
	version: config.minecraftserver.version
}

mcData = require('minecraft-data')(config.minecraftserver.version)

if (config.antiAntiAFK) setInterval(function () {
	//if(proxyClient == null  && finishedQueue) client.write("chat", { message: "/msg RusherB0t !que", position: 1 })
}, 50000)


// function to disconnect from the server
function stop() {
	finishedQueue = !config.minecraftserver.is2b2t;
	client.end(); // disconnect
	if (proxyClient) {
		proxyClient.end("Stopped the proxy."); // boot the player from the server
	}
	server.close(); // close the server
}

// function to start the whole thing
function start() {
	console.log('Starting to join 2b2t'.brightGreen);
	doing = "auth";
	if (config.minecraftserver.onlinemode) {
		options.username = mc_username;
		options.password = mc_password;
		options.tokensLocation = "./minecraft_token.json"
		options.tokensDebug = false;
		tokens.use(options, function (_err, _opts) {

			if (_err) throw _err;

			client = mc.createClient(_opts);
			join();
		});
	} else {
		options.username = config.minecraftserver.username;
		client = mc.createClient(options);// connect to 2b2t
		join();
	}
}
function activity(msg){
	console.log('Activity: '+msg.yellow);
}




entities=[];
yourEntityId = 0;
playerInfo=[];


packetSend=[];

packetList={
	
}

mapPackets = {
	
}

multiBlockChange = {
	
}

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
			if(array[v][0]=='login'){
				console.log(condition.toString());
			}
			list.push(array.splice(v,1));
			v--;
		}	
	}
	return(list);
}



function packet_add(name,data){
	//console.log('Adding: '+name);
	packetSend.push([name,data]);
}

function packet_once(name,data){
	//console.log('Running once: '+name);
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

setInterval(function(){
	if(curPos!=null){
	for(var k =packetSend.length-1; k>=0 ;k--){
			let packet = packetSend[k];
			
			if(packet!=null){
			switch(packet[0]){
				case "map_chunk":
					var dist = Math.abs(packet[1].x*16 - curPos.x) + Math.abs(packet[1].z*16 - curPos.z);
					if(dist>400){
						packetSend.splice(k,1);
						continue;
					}
				break;
				case "unload_chunk":
					var dist = Math.abs(packet[1].chunkX*16 - curPos.x) + Math.abs(packet[1].chunkZ*16 - curPos.z);
					if(dist>400){
						packetSend.splice(k,1);
						continue;
					}				
				break;
				case "block_change":
					var dist = Math.abs(packet[1].location.x - curPos.x) + Math.abs(packet[1].location.z - curPos.z);
					if(dist>400){
						packetSend.splice(k,1);
						continue;
					}				
				break;
				case "spawn_entity":
					if(entities[packet[1].entityId]==null){
						filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
						continue;	
					}
				break;
				case "spawn_entity_living":
					if(entities[packet[1].entityId]==null){
						filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
						continue;	
					}
				break;
				case "named_entity_spawn":
					if(entities[packet[1].entityId]==null){
						filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
						continue;	
					}
				break;
				case "entity_metadata":
					if(entities[packet[1].entityId]==null){
						filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
						continue;						
					}
				break;
				case "entity_update_attributes":
					if(entities[packet[1].entityId]==null){
						filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
						continue;					
					}
				break;
				case "entity_status":
					if(entities[packet[1].entityId]==null){
						filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
						continue;				
					}
				break;
				case "set_passengers":
					if(entities[packet[1].entityId]==null){
						filterArray(packetSend,packetData => packetData[0].search('entity')!=-1 && packet[1].entityId == packetData[1].entityId);
						continue;				
					}
				break;

			
			}
			}
	}
	
	for(entityId in entities){
		let entity = entities[entityId];
		var dist = Math.abs(entity.x - curPos.x) + Math.abs(entity.z - curPos.z);
		if(dist>200){
			filterArray(packetSend,packet => packet[1].entityId == entityId);
			delete entities[entityId];
		}
	}

	for(property in multiBlockChange){
		let chunkData = multiBlockChange[property];
		var dist = Math.abs(chunkData.chunkX*16 - curPos.x) + Math.abs(chunkData.chunkZ*16 - curPos.z);
		if(dist>200){
			delete multiBlockChange[property];
		}
	}
	
	/*for(playerIndex in playerInfo){
		let player = playerInfo[playerIndex];
		let deleteThis = 1;
		for(entityId in entities){
			let entity = entities[entityId];
			if(entity.playerUUID == player.data[0].UUID){
				deleteThis=0;
				break;
			}
		}
		if(deleteThis==1){
			console.log('Deleting: '+player.data[0].name);
			playerInfo.splice(playerIndex,1);
		}
	}*/
	
	
	}
},16);


entities = [];

dimension=null;
respawnPacket=null;

canStack=0;
saveItem=null;

windowItems = {
	
}


function join() {
	let ETAhour;
	let timepassed;
	let notisend = false;
	doing = "queue"
	activity("Starting the queue...");
	client.on("packet", (data, meta) => { // each time 2b2t sends a packet

		switch (meta.name) {
			default:
				console.log(meta.name);
			break;
			case "boss_bar":
				packet_once(meta.name,data);
			break;
			case "unlock_recipes":
				packet_once(meta.name,data);
			break;
			case "success":
				//packet_add(meta.name,data);			
			break;
			case "compress":
				//packet_add(meta.name,data);						
			break;
			case "encryption_begin":
				//packet_once(meta.name,data);
			break;
			case "window_items":
				//console.log(data);
				//packet_once(meta.name,data);
				windowItems[data.windowId] = data;
			

			break;
			case "open_window":
			switch(data.inventoryType){
				case "minecraft:chest":
				
				break;
			}
			break;
			case "close_window":
				console.log(data);
			//	delete packetList.open_window;
			break;
			case "collect":
			filterArray(packetSend,packet => packet[1].entityId == data.collectedEntityId);
			
			delete entities[data.collectedEntityId];
			break;
			case "block_break_animation":
			
			break;
			case "tile_entity_data":
				console.log(data);
			break;
			case "update_time":
				packet_once(meta.name,data);
			break;
			case "held_item_slot":
				packet_once(meta.name,data);
			break;
			case "abilities":
				packet_once(meta.name,data);
			break;
			case "difficulty":
				packet_once(meta.name,data);
			break;
			case "world_border":
				packet_once(meta.name,data);
			break;
			case "spawn_position":
				packet_once(meta.name,data);
			break;
			case "advancements":
				packet_once(meta.name,data);
			break;
			case "spawn_entity_weather":
			
			break;
			case "custom_payload":
				//packet_add(meta.name,data);
			break;
			
			
			/*
			ONLINE CODE EXECUTER WOULD BE NICE
			MAKE IT SO BOT IS NOT GLOBAL OR SOMETHING, IDK you prob only need one... but like yeah make it so you can delete it
			ADD BACKUP AND RESTORE BUTTONS TO PACKET UI
			*/
			
			case "craft_progress_bar":
			
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
				packet_add(meta.name,data);
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
				if(data.data[0].name!=null && add==1){
					playerInfo.push(data);
				}
				//packet_add(meta.name,data);
			break;
			case "set_slot":
	

				if(canStack==1 && saveItem!=null && data.windowId>=0){
					
					//Same item and under stack size 
					if( diff = windowItems[data.windowId].items[data.slot].blockId == saveItem.blockId && saveItem.itemCount < mcData.items[saveItem.blockId].stackSize &&  
					//The server is saying to make it less or make it undefined 
					
					(data.item.itemCount < windowItems[data.windowId].items[data.slot].itemCount || (data.item.itemCount==null && windowItems[data.windowId].items[data.slot].itemCount!=null))
					){
						let diff=0;
						if(data.item.itemCount!=null){
						 diff = windowItems[data.windowId].items[data.slot].itemCount - data.item.itemCount;
						}else{
						 diff = windowItems[data.windowId].items[data.slot].itemCount;
						}
						saveItem.itemCount+=diff;
						console.log(saveItem.itemCount);
					}
				}	
				
				if(data.windowId>=0){
					console.log(data.windowId);

					windowItems[data.windowId].items[data.slot] = data.item;
				}
				
				if(data.slot==-1){
					saveItem = data.item;
				}



				
			break;
			case "transaction":
	
			break;
			case "camera":
				
			break;
			case "combat_event":
			
			break;
			case "remove_entity_effect":
			
			break;
			case "explosion":
			
			break;
			case "position":
				curPos = data;
				//packet_once(meta.name,data);
			break;
			case "map_chunk":
				//if(config.chunkCaching) chunkData.set(data.x + "_" + data.z, data);
				//packetSend.push([meta.name,data]);
				//map_add(data);
				
				
				//console.log(data.x+'_'+data.z,filterArray(packetSend,packet => packet[0] == 'map_chunk' && packet[1].x == data.x && packet[1].z == data.z,data));
				
				packet_add(meta.name,data);

				break;
			case "unload_chunk":
			filterArray(packetSend,packet => packet[0] == 'map_chunk' && packet[1].x == data.chunkX && packet[1].z == data.chunkZ,data);
			//packet_add(meta.name,data);
				//map_remove(data);
				//if(config.chunkCaching) chunkData.delete(data.chunkX + "_" + data.chunkZ);
				break;
				case "spawn_entity_experience_orb":
				
				break;
			case "playerlist_header":
				if (!finishedQueue && config.minecraftserver.is2b2t) { // if the packet contains the player list, we can use it to see our place in the queue
					let headermessage = JSON.parse(data.header);
					let positioninqueue = headermessage.text.split("\n")[5].substring(25);
					if (!totalWaitTime) {
						totalWaitTime = Math.pow(positioninqueue / 35.4, 2 / 3);
					}
					timepassed = -Math.pow(positioninqueue / 35.4, 2 / 3) + totalWaitTime;
					ETAhour = totalWaitTime - timepassed;
					const etaAmnt = Math.floor(ETAhour) + "h " + Math.round((ETAhour % 1) * 60) + "m";
					server.motd = `Place in queue: ${positioninqueue} ETA: ${etaAmnt}`; // set the MOTD because why not
					console.log('Placed in queue: '.cyan+positioninqueue.brightRed+' ETA: '.cyan+etaAmnt.brightRed);
				}
				packet_once(meta.name,data);
				break;
			case "chat":
				if (finishedQueue === false) { // we can know if we're about to finish the queue by reading the chat message
					// we need to know if we finished the queue otherwise we crash when we're done, because the queue info is no longer in packets the server sends us.
					let chatMessage = JSON.parse(data.message);
					if (chatMessage.text && chatMessage.text === "Connecting to the server...") {
						if (proxyClient == null) { //if we have no client connected and we should restart
							
							stop();
						} else {
							finishedQueue = true;
							logActivity("Queue is finished");
						}
					}
				}
				break;
			case "respawn":

				entities=[];
				respawnPacket = data;
				
				for(var k =0; k<packetSend.length;k++){
					if(packetSend[k][0]=='login'){
						packetSend[k][1].gameMode = data.gamemode;
						packetSend[k][1].dimension = data.dimension;
						packetSend[k][1].levelType = data.levelType;
					}
				}
				
				break;
			case "login":
				console.log('Connected!'.cyan);
				//data.gameMode = 0;
				//loginpacket = data;
				yourEntityId = data.entityId;
				client.write('client_command', { payload: 0 })
				packet_add(meta.name,data);
				console.log(packetSend[packetSend.length-1]);
				
				createServer(client.version);
				break;
			case "game_state_change":
				packet_once(meta.name,data);
			break;
			case "block_action":

			break;
			case "entity_head_rotation":
				
			//packet_add(meta.name,data);				
			break;
			case "entity_velocity":
			//	packet_add(meta.name,data);				
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
				packet_add(meta.name,data);
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

				let chunkId = data.chunkX+'_'+data.chunkZ;
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
				}
				
			//	packet_add(meta.name,data);
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
					
			break;
			case "sound_effect":
			
			break;
			case "tab_complete":
			
			break;
			case "animation":
			//	packet_add(meta.name,data);			
			break;
			case "world_event":
				
				//packet_once(meta.name,data);			
			break;
			case "world_particles":
			
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
			
			break;
			case "set_passengers":
				filterArray(packetSend,packet => packet[0] == 'set_passengers' && packet[1].entityId == data.entityId);
				packet_add(meta.name,data);
			break;
			case "named_sound_effect":
			
			break;
			case "update_view_position":
				packet_once(meta.name,data);
			break;
			case "update_view_distance":
				packet_once(meta.name,data);
			break;
			case "update_light":
				
			break;
			case "declare_recipes":
				packet_once(meta.name,data);
			break;
			case "tags":
				packet_once(meta.name,data);
			break
			case "declare_commands":
				packet_once(meta.name,data);
			break;
			case "map":
				packet_add(meta.name,data);
			break;
		}
		if (proxyClient) { // if we are connected to the proxy, forward the packet we recieved to our game.
			filterPacketAndSend(data, meta, proxyClient);
		}
	});

	// set up actions in case we get disconnected.
	client.on('end', () => {
		if (proxyClient) {
			proxyClient.end("Connection reset by 2b2t server.\nReconnecting...");
			proxyClient = null
		}
		//stop();
		if (!stoppedByPlayer) log("Connection reset by 2b2t server. Reconnecting...");
		if (config.reconnect.onError) setTimeout(reconnect, 6000);
	});

	client.on('error', (err) => {
		if (proxyClient) {
			proxyClient.end(`Connection error by 2b2t server.\n Error message: ${err}\nReconnecting...`);
			proxyClient = null
		}
		stop();
		log(`Connection error by 2b2t server. Error message: ${err} Reconnecting...`);
		if (config.reconnect.onError) {
			if (err == "Error: Invalid credentials. Invalid username or password.") setTimeout(reconnect, 60000);
			else setTimeout(reconnect, 4000);
		}
	});
	function createServer(version){
	server = mc.createServer({ // create a server for us to connect to
		'online-mode': false,
		encryption: false,
		host: '0.0.0.0',
		port: config.ports.minecraft,
		version: version,
		'max-players': maxPlayers = 1
	});

	server.on('login', (newProxyClient) => { // handle login

		//client.write('client_command', { payload: 0 });
		
		//newProxyClient.write('login',loginpacket);
		

		for(var k =0;k<playerInfo.length;k++){
			newProxyClient.write('player_info',playerInfo[k]);
		}
	
		if(respawnPacket!=null){
			newProxyClient.write('respawn',respawnPacket);
		}
		
		for(var k=0; k<packetSend.length; k++){
			newProxyClient.write(packetSend[k][0],packetSend[k][1]);
		}
		

		
		/*for(mapData in mapPackets){
			newProxyClient.write('map_chunk',mapPackets[mapData]);
		}*/

		if(curPos!=null){
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
		
		/*if(itemList.items[1].blockId==-1 && 
		itemList.items[2].blockId==-1 && 
		itemList.items[3].blockId==-1 && 
		itemList.items[4].blockId==-1  ){
			itemList.items[0]={
					  blockId: -1,
					  itemCount: undefined,
					  itemDamage: undefined,
					  nbtData: undefined
			}
		}*/
		
		for(property in packetList){
			newProxyClient.write(property,packetList[property]);
		}
		
		for(window in windowItems){
			newProxyClient.write('window_items',windowItems[window]);
		}
		
		
		for(property in multiBlockChange){
			newProxyClient.write('multi_block_change',multiBlockChange[property]);
		}
		
		newProxyClient.on('packet', (data, meta) => { // redirect everything we do to 2b2t
			switch(meta.name){
				case "position":
					curPos.x = data.x;
					curPos.y = data.y;
					curPos.z = data.z;
				break;
				case "window_click":
				console.log(data);
				
				if(saveItem!=null && saveItem.blockId==-1){
					saveItem=null;
				}
				
				//NON SHIFT 
				if(data.mode==0){				
				//Make sure we aren't grabbing from our crafting output
				if(data.slot!=0 && data.windowId==0){
				
				switch(data.mouseButton){
					

					
					//LEFT CLICK
					case 0:

					//SEE IF WE MUST DROP DROP YOU MUST STACK IF NEEDED THO
					if(saveItem!=null){
						//Make sure we aren't double click stacking
						if(data.mode!=6){
								if(data.slot==-1 || data.slot==0){
									return;
								}
								if(data.slot==-999){
									saveItem=null;
									return;
								}
							switch(data.slot){
								
								case 5:
								if(mcData.items[saveItem.blockId].name.search('helmet')==-1){return;}break;
								case 6:
								if(mcData.items[saveItem.blockId].name.search('chestplate')==-1){return;}break;	
								case 7:
								if(mcData.items[saveItem.blockId].name.search('legging')==-1){return;}break;										
								case 8:
								if(mcData.items[saveItem.blockId].name.search('boots')==-1){return;}break;										
							}
							
							//Replace if empty
							if(windowItems[data.windowId].items[data.slot].blockId==-1 ){
								windowItems[data.windowId].items[data.slot]= saveItem;
								saveItem=null;			
							}else{
								//IF IT IS THE SAME ITEM AND LESS THAN STACK SIZE 
								if(saveItem.blockId == windowItems[data.windowId].items[data.slot].blockId && JSON.stringify(saveItem.nbtData) == JSON.stringify(windowItems[data.windowId].items[data.slot].nbtData) ){
									if(windowItems[data.windowId].items[data.slot].itemCount<mcData.items[saveItem.blockId].stackSize){
									windowItems[data.windowId].items[data.slot].itemCount+= saveItem.itemCount;
									console.log('NEW:'+windowItems[data.windowId].items[data.slot].itemCount);
									saveItem.itemCount=0;
									if(windowItems[data.windowId].items[data.slot].itemCount>mcData.items[saveItem.blockId].stackSize){
										let left = windowItems[data.windowId].items[data.slot].itemCount - mcData.items[saveItem.blockId].stackSize;
										console.log('LEFTOVER:'+left);
										windowItems[data.windowId].items[data.slot].itemCount = mcData.items[saveItem.blockId].stackSize
										saveItem.itemCount=left;
									}
								}
								//OTHERWISE ITS THE OL' SWITCHAROO
								}else{
									let save = {...windowItems[data.windowId].items[data.slot]};
									windowItems[data.windowId].items[data.slot]=saveItem;
									saveItem = save;
									
								}
							}
							

							
						}else{
							canStack=1;
							setTimeout(function(){
								canStack=0;
							},1000);
					}
					//PICKUP
					}else{
						
						if(data.item.blockId!=-1){
							saveItem = data.item;
							windowItems[data.windowId].items[data.slot]={...emptyItem}
						}
					
					}

								
					break;
					
					
					//RIGHT CLICK
					case 1:
						//DROP OR SWITCH
						if(saveItem!=null){
							//THIS DOES NOTHING SO DONT DO ANYTHINGGG
							if(data.slot!=-1 && data.slot!=0){
							saveItem.itemCount-=1;
							//IF WE ARE NOT DROPPING OUT OF OUR INVENTORY
							if(saveItem.slot!=-999){
								//DROP ONE INTO EMPTY SLOT
								if(data.item.itemCount==null){
									windowItems[data.windowId].items[data.slot] = {...saveItem};
									windowItems[data.windowId].items[data.slot].itemCount=1;
								}else{
									//IF IT IS THE SAME ITEM
									if(saveItem.blockId == windowItems[data.windowId].items[data.slot].blockId && JSON.stringify(saveItem.nbtData) == JSON.stringify(windowItems[data.windowId].items[data.slot].nbtData)){
										//IF IT IS LESS THAN STACK SIZE 
										if(windowItems[data.windowId].items[data.slot].itemCount<mcData.items[saveItem.blockId].stackSize){
											//ADD TO ITS SIZE
											windowItems[data.windowId].items[data.slot].itemCount+=1
										}
									//IF IT IS NOT THE SAME ITEM SWITCH SPOTS
									}else{
										console.log('SWITCH');
										saveItem.itemCount+=1;
										let save = {...windowItems[data.windowId].items[data.slot]}
										console.log(save);
										windowItems[data.windowId].items[data.slot]=saveItem;
										saveItem = save;
									}
								}
							}
							
							if(saveItem.itemCount<=0){
								saveItem=null;
							}
							
							}
							
						//SPLIT
						}else{
							if(windowItems[data.windowId].items[data.slot]!=null && windowItems[data.windowId].items[data.slot].blockId!=-1){
								var halfAmnt = Math.ceil(windowItems[data.windowId].items[data.slot].itemCount/2);
								saveItem = {...windowItems[data.windowId].items[data.slot]}
								saveItem.itemCount = halfAmnt;
								windowItems[data.windowId].items[data.slot].itemCount-=halfAmnt;
								if(windowItems[data.windowId].items[data.slot].itemCount<=0){
									windowItems[data.windowId].items[data.slot]={...emptyItem}
								}
							}
						}
					break;
				}
				}
				break;
				//SHIFT CLICK
				}else if(data.windowId==0 && data.slot>=1){
					//NO MIDDLE CLICKY!!
					if(data.mouseButton<=1){
						console.log('SLOTTT');
						console.log(data.slot);
						let item = windowItems[0].items[data.slot];
						
						
						if(item.blockId!=-1){
							
							const itemName = mcData.items[item.blockId].name;

							
							if(itemName.search('helmet')!=-1 && data.slot !=5){
								if(windowItems[0].items[5].blockId==-1){
									windowItems[0].items[5] = windowItems[0].items[data.slot]
									windowItems[0].items[data.slot] = {...emptyItem};
									return;
								}
							}
							if(itemName.search('chestplate')!=-1 && data.slot!=6){
								if(windowItems[0].items[6].blockId==-1){
									windowItems[0].items[6] = windowItems[0].items[data.slot]
									windowItems[0].items[data.slot] = {...emptyItem};
									return;
								}
							}
							if(itemName.search('leggings')!=-1 && data.slot!=7){
								if(windowItems[0].items[7].blockId==-1){
									windowItems[0].items[7] = windowItems[0].items[data.slot]
									windowItems[0].items[data.slot] = {...emptyItem};
									return;
								}
							}
							if(itemName.search('boots')!=-1 && data.slot!=8){
								if(windowItems[0].items[8].blockId==-1){
									windowItems[0].items[8] = windowItems[0].items[data.slot]
									windowItems[0].items[data.slot] = {...emptyItem};
									return;
								}
							}
							if(itemName.search('shield')!=-1 && data.slot!=45){
								if(windowItems[0].items[45].blockId==-1){
									windowItems[0].items[45] = windowItems[0].items[data.slot]
									windowItems[0].items[data.slot] = {...emptyItem};
									return;
								}
							}
							
							let moveInto = 'top';
							
							if(data.slot>=1 && data.slot<=4){
								moveInto = 'full';
							}
							if(data.slot==0){
								moveInto = 'hot';
							}
							if(data.slot>=5 && data.slot<=8){
								moveInto = 'top';
							}
							
							if(data.slot>=9 && data.slot<=35){
								moveInto='hot';
							}
							
							if(data.slot>=36){
								moveInto='top';
							}
							let start =0;
							let end=0;
							
							switch(moveInto){
								case "top":
									start=9;
									end=35;
	
								break;
								case "hot":
								
									start=36;
									end=44;
			
								break;
								case "full":
									start=9;
									end=44;
								break;
							}
							
							for(var k=start;k<=end;k++){
								
								
								if(item.blockId == windowItems[data.windowId].items[k].blockId && 
								JSON.stringify(item.nbtData) == JSON.stringify(windowItems[data.windowId].items[k].nbtData)
								&& windowItems[data.windowId].items[k].itemCount<mcData.items[item.blockId].stackSize){
									windowItems[data.windowId].items[k].itemCount+= item.itemCount;
									if(windowItems[data.windowId].items[k].itemCount>mcData.items[item.blockId].stackSize){
										
										let leftOver = windowItems[data.windowId].items[k].itemCount  -  mcData.items[item.blockId].stackSize;
										windowItems[data.windowId].items[k].itemCount = 64;
										item.itemCount = leftOver;
										
									}else{
										windowItems[0].items[data.slot] = {...emptyItem};
										return;
									}
								}
								
							}
							
							for(var k=start;k<=end;k++){
								if(windowItems[data.windowId].items[k].blockId==-1){
									windowItems[data.windowId].items[k] = item;
									windowItems[data.windowId].items[data.slot] = {...emptyItem};
									return;
								}
							}
							
							
							
							
							
						}
						
					}
				}
				case "close_window":
					if(data.windowId!=0){
						delete windowItems[data.windowId]
					}
				break;
				case "block_dig":
					
					if(data.status == 6 && data.location.x == 0 && data.location.y == 0 && data.location.z == 0 && data.face==0){
						let savePrev = {...windowItems[0].items[45]};
						windowItems[0].items[45] = windowItems[0].items[packetList.held_item_slot.slot+36].item
						//inventory[packetList.held_item_slot.slot+36].item = savePrev;
					}
				break;
				case "held_item_slot":
					packetList.held_item_slot.slot = data.slotId;
				break;
				case "position_look":
					curPos.x = data.x;
					curPos.y = data.y;
					curPos.z = data.z;
					curPos.pitch = data.pitch;
					curPos.yaw = data.yaw;
				break;
				case "look":
					curPos.pitch = data.pitch;
					curPos.yaw = data.yaw;
				break;
			}
			

			filterPacketAndSend(data, meta, client);
		});
		
		proxyClient = newProxyClient;
	});
	}
}

function sendChunks() {
	if(config.chunkCaching) chunkData.forEach((data) => {
		proxyClient.write("map_chunk", data);
	});
}

function log(logmsg) {
	if (config.logging) {
		fs.appendFile('2bored2wait.log', DateTime.local().toLocaleString({
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		}) + "	" + logmsg + "\n", err => {
			if (err) console.error(err)
		})
	}
}

function reconnect() {
	doing = "reconnect";
	if (stoppedByPlayer) stoppedByPlayer = false;
	else {
		logActivity("Reconnecting... ");
		reconnectLoop();
	}
}

function reconnectLoop() {
	mc.ping({host: config.minecraftserver.hostname, port: config.minecraftserver.port}, (err) => {
		if(err) setTimeout(reconnectLoop, 3000);
		else start();
		});
}

//function to filter out some packets that would make us disconnect otherwise.
//this is where you could filter out packets with sign data to prevent chunk bans.
 filterPacketAndSend = function(data, meta, dest) {
	if (meta.name !== "keep_alive" /*&& meta.name !== "update_time"*/) { //keep alive packets are handled by the client we created, so if we were to forward them, the minecraft client would respond too and the server would kick us for responding twice.
		dest.write(meta.name, data);
	}
}

function round(number) {
	if (number > 0) return Math.ceil(number);
	else return Math.floor(number);
}





function timeStringtoDateTime(time) {
	starttimestring = time.split(" ");
	starttimestring = starttimestring[1];
	let starttime = starttimestring.split(":");
	let startdt = DateTime.local().set({hour: starttime[0], minute: starttime[1], second: 0, millisecond: 0});
	if (startdt.toMillis() < DateTime.local().toMillis()) startdt = startdt.plus({days: 1});
	return startdt;
}

function calcTime(msg) {
	doing = "calcTime"
	interval.calc = setInterval(function () {
		https.get("https://2b2t.io/api/queue", (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});
			resp.on("end", () => {
				data = JSON.parse(data);
				totalWaitTime = Math.pow(data[0][1] / 35.4, 2 / 3); // data[0][1] is the current queue length
				playTime = timeStringtoDateTime(msg);
				if (playTime.toSeconds() - DateTime.local().toSeconds() < totalWaitTime * 3600) {
					start();
					clearInterval(interval.calc);
				}
			});
		});
	}, 60000);

}
function stopQueing() {
	stoppedByPlayer = true;
	stop();
}

function logActivity(update) {
	activity(update);
	log(update);
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
		proxyClient.write('game_state_change', { reason: 3, gameMode: 0 });
	},
	attemptRespawn : function(){
		client.write('client_command', { payload: 0 });
	}
};
