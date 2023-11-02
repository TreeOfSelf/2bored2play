/*
         ░                                                     					
**HIGH PRIORITY:

-Make it so if blocks are near avoided blocks it adds to their weight, if he must path near danger blocks he must be careful or go slow
-Put on github asap 
-Interpolate movement in viewer 
-Fix his inability to pathfind in water


*LOW PRIORITY: 

-Add health/food to viewer 
-Add auto updater and NPM installs 
-Change vars to lets when needed

					
*/

// Requires
const fs = require('fs');
const path = require('path');
const Vec3 = require('vec3');
var mineflayer = require('mineflayer');
const colors = require('colors');
const print = require('../cmd/print.js');

//Definitions 
const normalizedPath = require("path").join(__dirname, "ai");
const ai = [];
var aiTimeout;
var bot;
var mcData;
var lightView;

process.on('message',(msg) => {
	switch(msg.name){
		
		//Set configuration, account information, and start the proxy
		case "start":
			config = msg.config;
			
			mcData = require('minecraft-data')(config.proxy.version)

			startBot();
			
		break;
		case "end":
			bot.end();
		break;
	}
});





function startBot(){
	

	
	getAis();
	
	if(config.connect.local==true){
		config.connect.host = config.connect.host;
		config.connect.password = null;
		config.connect.username = 'bot';
		config.connect.proxyServer = false;
		print.say(("Connecting to local server on port: "+config.connect.port).yellow);
	}else{
		print.say(("Connecting to: "+config.connect.host+':'+config.connect.port).yellow);
	}

	bot = mineflayer.createBot({
		host: config.connect.host,
		port: parseInt(config.connect.port),
		username: config.connect.username, 
		password: config.connect.password,
		version: config.connect.version,
	});



	//Empty events for the bot 
	const botEventsList=['blockUpdate','chunkColumnUnload','chunkColumnLoad','spawn','health','diggingCompleted','diggingAborted','move','forcedMove','physicTick','path_update','goal_reached','goal_reset','entityHurt'];
	const botEvents={};
	for(var k=0;k<botEventsList.length;k++){
		//Create an empty function for now, then when we switch AI we replace this empty function with that AI's function 
		var eventName = botEventsList[k];
		botEvents[eventName]=function(){};
		bot.on(eventName, botEvents[eventName]);
	}
	let lastGet = 0;
	let tick=0;
	/*setTimeout(function(){
		bot.on('forcedMove',function(){
			console.log('FOCED MOVE');
			bot.controlState.jump=true;
			if(Date.now()-lastGet<5000){
				tick+=1;
				if(tick>=3){
					process.send(['bot_restart']);
				}
			}else{
				tick=0;
			}
			lastGet = Date.now();
			
		});
	},5000);*/


	//Function that takes an AI type and injects all the bot event functions with that AI's functions

	function bot_set_events(aiType){
		console.log("Using ai "+aiType);
		for(var k=0;k<botEventsList.length;k++){
			var eventName = botEventsList[k];
			//Set the event to run the AI's event if it exists, otherwise just set it to blank
			if(ai[aiType][eventName]!=undefined){
				print.annoy('Injecting: '.yellow+eventName.red);
				//First we remove the previous event listener 
				bot.off(eventName, botEvents[eventName]);
				//Store new event function 
				botEvents[eventName] = ai[aiType][eventName];
				//Add new event function to the listener
				bot.on(eventName, botEvents[eventName]);
			}else{
				//Set to blank if this AI does not have this event function 
				bot.off(eventName, botEvents[eventName]);
				botEvents[eventName] = function(){};
				bot.on(eventName, botEvents[eventName]);
			}
		}
	}


			
	print.say("Initializing bot events".yellow);
	
	refreshTimeout =  setTimeout(function(){
		process.send(['proxy_restart']);
	},5000);
	
	
	//Once connected set bot features 
	bot.once('spawn', () => {
		
		


		//If there is a proxy server we wait to spawn out of the proxy server, otherwise we start on the next physicTick of the bot
		var startAIAt;
		if(config.connect.proxyServer==true){
			startAIAt = 'spawn';
			print.say('Waiting for proxy server...'.yellow)
		}else startAIAt = 'physicTick';


		bot.once(startAIAt, () => {
			
			clearTimeout(refreshTimeout);
			
			if(config.viewer.enabled==true && false){
				if(lightView==null){
					lightView = require(__dirname+'/utils/lightViewer/lightView.js');
				}
				lightView.start(bot);
			}else{
				
			}
				
			print.say(("Connected and spawned in server! Running Minecraft version: "+bot.version).green);
			//Set bot physics from config 
			
			for(property in config.physics){
				bot.physics[property] = parseFloat(config.physics[property]);
				console.log('Changed bot physic: '+property+' to: '+config.physics[property]);
			}
			


			let aiSet =config.ai.start;
			
			if(aiSet){
				print.say("Running AI module ".green + aiSet.red);
				print.say("Setting bot events to AI module's events".yellow);		
				bot_set_events(aiSet);
				print.say(("Starting AI brain, thinking every ").yellow+config.ai.thinkInterval+'ms');
				var aiThink = ai[aiSet].think;
				bot.physicsEnabled=false;
				//This is a timeout instead of a set interval so that the think interval can be dynamically changed
				if(aiTimeout!=null){
					clearTimeout(aiTimeout);
				}
				
				aiBrain = function(){
					aiTimeout = setTimeout(function(){
						aiThink(bot);
						aiBrain();
					},config.ai.thinkInterval);
				}
				aiBrain();	
				ai[aiSet].start(bot);
			}

		
		});

	});
	console.log('Bot started!'.brightGreen);

}



function getAis(){
fs.readdirSync(normalizedPath).forEach(function(file) {
	if(file.search('.js')!=-1){
		const aiName = file.replace('.js','');
		print.annoy(("Loading "+aiName+" AI module").cyan);
		ai[aiName] = require("./ai/" + file);
	}
});
}


