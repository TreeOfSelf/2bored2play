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


inventory= [];
entities=[];
entityId = 0;
playerInfo=[];


packetSend=[];

packetList={
	
}

mapPackets = {
	
}

multiBlockChange = {
	
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
						k++;
					}
				break;
				case "unload_chunk":
					var dist = Math.abs(packet[1].chunkX*16 - curPos.x) + Math.abs(packet[1].chunkZ*16 - curPos.z);
					if(dist>400){
						packetSend.splice(k,1);
						k++;
					}				
				break;
				case "block_change":
					var dist = Math.abs(packet[1].x - curPos.x) + Math.abs(packet[1].z - curPos.z);
					if(dist>400){
						packetSend.splice(k,1);
						k++;
					}				
				break;
				case "spawn_entity":
					if(entities[packet[1].entityId]==null){
					packetSend.filter(packet => packet[1].entityId == entityId);
					packetSend.splice(k,1);
					k++;
					}
				break;
				case "spawn_entity_living":
					if(entities[packet[1].entityId]==null){
					packetSend.filter(packet => packet[1].entityId == entityId);
					packetSend.splice(k,1);
					k++;
					}
				break;
				case "named_entity_spawn":
					if(entities[packet[1].entityId]==null){
					packetSend.filter(packet => packet[1].entityId == entityId);
					packetSend.splice(k,1);
					k++;
					}
				break;
				case "entity_metadata":
					if(entities[packet[1].entityId]==null){
					packetSend.filter(packet => packet[1].entityId == entityId);
					packetSend.splice(k,1);
					k++;						
					}
				break;
				case "entity_update_attributes":
					if(entities[packet[1].entityId]==null){
					packetSend.filter(packet => packet[1].entityId == entityId);
					packetSend.splice(k,1);
					k++;					
					}
				break;
				case "entity_status":
					if(entities[packet[1].entityId]==null){
					packetSend.filter(packet => packet[1].entityId == entityId);
					packetSend.splice(k,1);
					k++;				
					}
				break;
				case "set_passengers":
					if(entities[packet[1].entityId]==null){
					packetSend.filter(packet => packet[1].entityId == entityId);
					packetSend.splice(k,1);
					k++;				
					}
				break;

			
			}
			}
	}
	
	for(entityId in entities){
		let entity = entities[entityId];
		var dist = Math.abs(entity.x - curPos.x) + Math.abs(entity.z - curPos.z);
		if(dist>200){
			packetSend.filter(packet => packet[1].entityId == entityId);
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
				packet_add(meta.name,data);
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
				packet_once(meta.name,data);
			break;
			case "open_window":
				packet_once(meta.name,data);
			break;
			case "close_window":
				packet_once(meta.name,data);
			break;
			case "collect":
				packetSend.filter(packet => packet[1].entityId == data.entityId);
			break;
			case "block_break_animation":
			
			break;
			case "tile_entity_data":
				//console.log(data);
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
			case "custom_payload":
				packet_add(meta.name,data);
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
				packetSend.filter(packet => packet[1].entityId == data.entityId);
				//packet_add(meta.name,data);
			break;
			case "entity_equipment":
				packet_add(meta.name,data);
			break;
			case "player_info":
				//See if perhaps, we can sort through our entities list, see if we have a match for the UUID and if not delete the player_info packet
				//console.log(meta.name,data);
				let add = 1;
				for(var k =0;k<playerInfo.length;k++){
					//console.log(playerInfo[k])
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
				inventory[data.slot] = data;
				//packet_add(meta.name,data);
			break;
			case "camera":
				
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
				let test  =packetSend.filter(packet => packet[1].x == data.x && packet[1].y == data.u && packet[1].groundUp!=null);
				packet_add(meta.name,data);

				break;
			case "unload_chunk":
			packetSend.filter(packet => packet[1].x == data.chunkX && packet[1].y == data.chunkY && packet[1].groundUp!=null);
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
				}
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
				//data.gameMode = 0;
				//Object.assign(loginpacket, data);
				/*if(dimension!=null){
					if(dimension!=data.dimension){
						console.log('RESTTY');
						packetSend = packetSend.splice(0,20);
						entities=[];
						playerInfo = [];
						multiBlockChange = {};
						
					}
				}*/
				entities=[];
				inventory=[];
				packet_add(meta.name,data);
				break;
			case "login":
				console.log('Connected!'.cyan);
				createServer(client.version);
				//data.gameMode = 0;
				//loginpacket = data;
				//entityId = data.entityId;
				client.write('client_command', { payload: 0 })
				packet_add(meta.name,data);
				break;
			case "game_state_change":
				packet_once(meta.name,data);
			break;
			case "block_action":
				//console.log(meta.name,data);
				//packet_add(meta.name,data);
			break;
			case "entity_head_rotation":
			//	packet_add(meta.name,data);				
			break;
			case "entity_velocity":
			//	packet_add(meta.name,data);				
			break;
			case "entity_move_look":
			/*if(entities[data.entityId]!=null){
				entities[data.entityId].x+= data.dX;
				entities[data.entityId].y+= data.dY;
				entities[data.entityId].z+= data.dZ;				
			}*/			
			//	packet_add(meta.name,data);
			break;
			case  "entity_update_attributes":
				packet_add(meta.name,data);
			break;
			case "rel_entity_move":
			/*if(entities[data.entityId]!=null){
				entities[data.entityId].x+= data.dX;
				entities[data.entityId].y+= data.dY;
				entities[data.entityId].z+= data.dZ;				
			}*/
			//	packet_add(meta.name,data);				
			break;
			case "experience":
				packet_once(meta.name,data);	
			break;
			case "update_health":
				packet_once(meta.name,data);	
			break;
			case "block_change":
				//console.log(meta.name,data);		
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
			//	packet_add(meta.name,data);			
			break;
			case "sound_effect":
			
			break;
			case "animation":
			//	packet_add(meta.name,data);			
			break;
			case "world_event":
				
				//packet_once(meta.name,data);			
			break;
			case "world_particles":
			
			break;
			case "transaction":
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
				packetSend.filter(packet => packet[0] == 'set_passengers' && packet[1].entityId == data.entityId);
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
		stop();
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
	
		
		
		for(var k=0; k<packetSend.length; k++){
			newProxyClient.write(packetSend[k][0],packetSend[k][1]);
		}
		

		
		/*for(mapData in mapPackets){
			newProxyClient.write('map_chunk',mapPackets[mapData]);
		}*/

		packetList.position = curPos;
		
		for(property in packetList){
			newProxyClient.write(property,packetList[property]);
		}
		
		
		for(var k =0; k<=44;k++){
			if(inventory[k]!=null){
				newProxyClient.write('set_slot',inventory[k]);
			}
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
function filterPacketAndSend(data, meta, dest) {
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
