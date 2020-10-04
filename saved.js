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
var proxyClient; // a reference to the client that is the actual minecraft game
var client; // the client to connect to 2b2t
var server; // the minecraft server to pass packets

options = {
	host: config.minecraftserver.hostname,
	port: config.minecraftserver.port,
	version: config.minecraftserver.version
}
if (config.antiAntiAFK) setInterval(function () {
	if(proxyClient == null  && finishedQueue) client.write("chat", { message: "/msg RusherB0t !que", position: 1 })
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

posSave = {
x: 0,
y: 1.62,
z: 0,
yaw: 0,
pitch: 0,
flags: 0x00
}

inventory= [];
entities=[];
entityId = 0;
playerInfo=[];
canDelete=0;
function fetchEntity (id) {
return entities[id] || (entities[id] = {})
}

/*setInterval(function(){
if(posSave!=null) {
	chunkData.forEach((data) => {
	var dataX = data.x*16;
	var dataZ = data.z*16
	var dist = Math.abs(dataX - posSave.x) + Math.abs(dataZ-posSave.z)
	if(dist>500){
		console.log('deleting: '+data.x + "_" + data.z);
		chunkData.delete(data.x + "_" + data.z)
	}
});
}
},1000);*/


function join() {
	let ETAhour;
	let timepassed;
	let notisend = false;
	doing = "queue"
	activity("Starting the queue...");
	client.on("packet", (data, meta) => { // each time 2b2t sends a packet
		packetSend.push([meta.name,data]);
		switch (meta.name) {
			default:
				console.log(meta.name);
			break;
			case "named_entity_spawn":
			entities[data.entityId]=data;
			break;
			case "player_info":
				//console.log(meta,data);
				var set =1;
				console.log(meta,data);
				for(var k =0;k<playerInfo.length;k++){
					//console.log(playerInfo[k])
					for(var c=0;c<playerInfo[k].data.length;c++){
						if(playerInfo[k].data[c].name == data.data[0].name){
							return;
						}
						
					}
				}
				playerInfo.push(data);
			break;
			case "window_items":
				//console.log(meta,data);
			break;
			case "spawn_entity":
			console.log('SPAWN_ENTITY',data.objectUUID,data.entityId);
			entities[data.entityId] = data;
			break;
			case "spawn_entity_living":
				console.log('LIVING',data.entityUUID,data.entityId);
				entities[data.entityId] = data			
			break;
			case "entity_status":
				/*if(entities[data.entityId]==null){
					entities[data.entityId]={};
				}
				entities[data.entityId].status = data.entityStatus;
				entities[data.entityId].entityId = data.entityId;*/
			break;
			case "entity_destroy":
				for(var k =0;k<data.entityIds.length;k++){
					delete entities[data.entityIds[k]];
				}
			break;
			case "entity_metadata":

			if(entities[data.entityId]!=null){
			if(entities[data.entityId].metadata == null){
				entities[data.entityId].metadata=[];
			}
			for(var k=0; k<data.metadata.length;k++){
			entities[data.entityId].metadata[data.metadata[k].key] = data.metadata[k]
			}
			entities[data.entityId].entityId = data.entityId;
			
			}


			break;
			
			case "entity_teleport":
			
			break;
			
			case "entity_equipment":
				//const entity = fetchEntity(data.entityId)
				//console.log(meta,data);
				/*for(var k =0;k<data.metadata.length;k++){
				
				}*/
			break;
			case "update_time":
			
			break;
			case "block_action":

			break;
			case "entity_head_rotation":
				
			break;
			case "entity_velocity":
				
			break;
			case "entity_move_look":
				
			break;
			case "entity_update_attributes":
			
			break;
			case "rel_entity_move":
				
			break;
			case "experience":
			
			break;
			case "update_health":
			
			break;
			case "block_change":
			
			break;
			case "multi_block_change":
			
			break;
			case "keep_alive":
			
			break;
			case "entity_look":
			
			break;
			case "sound_effect":
			
			break;
			case "animation":
			
			break;
			case "world_event":
			
			break;
			case "set_slot":
				inventory[data.slot] = {...data};
				//console.log(meta,data);
			break;
			case "position":
				posSave = {...data};
			break;
			case "map_chunk":
				if(config.chunkCaching) chunkData.set(data.x + "_" + data.z, data);
				break;
			case "unload_chunk":
				//if(config.chunkCaching) chunkData.delete(data.chunkX + "_" + data.chunkZ);
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
			data.gameMode = 0;
				Object.assign(loginpacket, data);
				
				break;
			case "login":
				data.gameMode = 0;
				loginpacket = data;
				entityId = data.entityId;
				console.log('entityId: '+entityId);
				client.write('client_command', { payload: 0 })
				break;
			case "game_state_change":
				//loginpacket.gameMode = data.gameMode;
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

	server = mc.createServer({ // create a server for us to connect to
		'online-mode': false,
		encryption: false,
		host: '0.0.0.0',
		port: config.ports.minecraft,
		version: config.MCversion,
		'max-players': maxPlayers = 1
	});

	server.on('login', (newProxyClient) => { // handle login
		
//newProxyClient.write('login', loginpacket);
		//posSave.teleportId=0;
	//	newProxyClient.write('position', posSave);
		/*client.write('client_command', { payload: 0 })
		setTimeout(sendChunks, 1000)

		newProxyClient.write('login', loginpacket);
		posSave.teleportId=0;
		newProxyClient.write('position', posSave);
		
		for(var k =0;k<playerInfo.length;k++){
			newProxyClient.write('player_info',playerInfo[k]);
		}
		
		for(entity in entities){
			let entityData = entities[entity];
			if(entityData.entityId!=entityId){
				if(entityData.playerUUID==null && entityData.objectUUID==null){
					console.log(entityData.entityId,entityData.playerUUID,entityData.objectUUID);
					newProxyClient.write('spawn_entity_living',entityData);
				}else if(entityData.entityUUID!=null){
					console.log(entityData.entityUUID);
					newProxyClient.write('named_entity_spawn',entityData);				
				}else if(entityData.objectUUID!=null){
					console.log('BULLSHITT');
					newProxyClient.write('spawn_entity',entityData);		
				}
			}else{
				console.log('FOUND ID'.red)
			}
		}
		

		setTimeout(function(){
			
			for(var k =0; k<=44;k++){
				if(inventory[k]!=null){
					newProxyClient.write('set_slot',inventory[k]);
				}
			}
			
		},1);*/
		var timer=0;
		for(var k =2; k<packetSend.length;k++){
			newProxyClient.write(packetSend[k][0],packetSend[k][1]);
		}
		
		
		newProxyClient.on('packet', (data, meta) => { // redirect everything we do to 2b2t
			filterPacketAndSend(data, meta, client);
		});
		proxyClient = newProxyClient;
	});
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
	if (meta.name !== "keep_alive" && meta.name !== "update_time") { //keep alive packets are handled by the client we created, so if we were to forward them, the minecraft client would respond too and the server would kick us for responding twice.
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
