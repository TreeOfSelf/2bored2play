/*

██████╗ ██████╗  ██████╗ ██████╗ ███████╗██████╗ ██████╗ ██████╗ ██╗      █████╗ ██╗   ██╗
╚════██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝██╔══██╗╚════██╗██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝
 █████╔╝██████╔╝██║   ██║██████╔╝█████╗  ██║  ██║ █████╔╝██████╔╝██║     ███████║ ╚████╔╝ 
██╔═══╝ ██╔══██╗██║   ██║██╔══██╗██╔══╝  ██║  ██║██╔═══╝ ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  
███████╗██████╔╝╚██████╔╝██║  ██║███████╗██████╔╝███████╗██║     ███████╗██║  ██║   ██║   
╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   
An automated Minecraft bot for anarchy servers developed by in 2020 by:

  ██████ ▓█████  ▄▄▄▄    ▄▄▄        ██████ ▄▄▄█████▓ ██▓ ▄▄▄       ███▄    █ 
▒██    ▒ ▓█   ▀ ▓█████▄ ▒████▄    ▒██    ▒ ▓  ██▒ ▓▒▓██▒▒████▄     ██ ▀█   █ 
░ ▓██▄   ▒███   ▒██▒ ▄██▒██  ▀█▄  ░ ▓██▄   ▒ ▓██░ ▒░▒██▒▒██  ▀█▄  ▓██  ▀█ ██▒
  ▒   ██▒▒▓█  ▄ ▒██░█▀  ░██▄▄▄▄██   ▒   ██▒░ ▓██▓ ░ ░██░░██▄▄▄▄██ ▓██▒  ▐▌██▒
▒██████▒▒░▒████▒░▓█  ▀█▓ ▓█   ▓██▒▒██████▒▒  ▒██▒ ░ ░██░ ▓█   ▓██▒▒██░   ▓██░
▒ ▒▓▒ ▒ ░░░ ▒░ ░░▒▓███▀▒ ▒▒   ▓▒█░▒ ▒▓▒ ▒ ░  ▒ ░░   ░▓   ▒▒   ▓▒█░░ ▒░   ▒ ▒ 
░ ░▒  ░ ░ ░ ░  ░▒░▒   ░   ▒   ▒▒ ░░ ░▒  ░ ░    ░     ▒ ░  ▒   ▒▒ ░░ ░░   ░ ▒░
░  ░  ░     ░    ░    ░   ░   ▒   ░  ░  ░    ░       ▒ ░  ░   ▒      ░   ░ ░ 
      ░     ░  ░ ░            ░  ░      ░            ░        ░  ░         ░ 
                      ░                                                     
					
**HIGH PRIORITY:

-Make it so if blocks are near avoided blocks it adds to their weight, if he must path near danger blocks he must be careful or go slow
-Put on github asap 
-Interpolate movement in viewer 
-Fix his inability to pathfind in water

**MEDIUM PRIORITY:

-Wrap this up in something so you can reload the code for the bot without reloading the whole think

*LOW PRIORITY: 

-Add health/food to viewer 
-Add auto updater and NPM installs 
-Change vars to lets when needed
-Instead of using global functions in Bot for CMD, change CMD to use the global.eval 
					
					
*/

// Core modules 
const fs = require('fs');
const path = require('path');
const ini = require('ini');

//These are global because they may need to be accessed often by other modules 
global.config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
global.pathRoot = path.resolve(__dirname);
//This is somewhat handy, but bad practice. It allows other modules to run code and return results at this level. 
global.rootEval = function(cmd){
	var result = eval(cmd);
	if(typeof result == 'object') console.log(result); else return(result);
};

global.webEval = function(cmd){
	try{
	var result = eval(cmd);
	return(JSON.stringify(result,null,4));
	}catch(e){
	return(JSON.stringify(e,null,4));	
	}
};



//Other modules
const mineflayer = require('mineflayer');
const { pathfinder, Movements} = require('./utils/pathfinder');
//const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals;
const Vec3 = require('vec3');
const mineflayerViewer = require('./utils/viewer').mineflayer
const aiControl = require('./AIcontrol.js');
const colors = require('colors');
const cmd = require('./cmd/cmd.js');
const print = require('./utils/print.js');
const connect = require('./connection.js');

//Import AI modules
const normalizedPath = require("path").join(__dirname, "ai");
const ai = [];

fs.readdirSync(normalizedPath).forEach(function(file) {
	const aiName = file.replace('.js','');
	print.annoy(("Loading "+aiName+" AI module").cyan);
	ai[aiName] = require("./ai/" + file);
});

bot = null;

//Create bot 

function startBot(){

	if(config.connect.local==true){
		config.connect.host = null;
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

	//Load bot plugins 
	bot.loadPlugin(pathfinder);



	//Empty events for the bot 
	const botEventsList=['spawn','health','diggingCompleted','diggingAborted','move','forcedMove','physicTick','path_update','goal_reached','goal_reset','entityHurt'];
	const botEvents={};
	for(var k=0;k<botEventsList.length;k++){
		//Create an empty function for now, then when we switch AI we replace this empty function with that AI's function 
		var eventName = botEventsList[k];
		botEvents[eventName]=function(){};
		bot.on(eventName, botEvents[eventName]);
	}


	//Function that takes an AI type and injects all the bot event functions with that AI's functions
	function bot_set_events(aiType){
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

	//Inject extra variables into bot
	bot.sprint = false;
	bot.controlled = false;

	//Once connected set bot features 
	bot.once('spawn', () => {
		
		//Enable web viwer 
		bot.viewer={};
		bot.viewer.drawLine=function(){};
		bot.viewer.erase=function(){};


		if(config.viewer.enabled==true){
			print.say("Starting viewer".yellow);
			mineflayerViewer(bot, { firstPerson : config.viewer.firstPerson , follow : config.viewer.follow, port: 3001 })
		}
			
		//If there is a proxy server we wait to spawn out of the proxy server, otherwise we start on the next physicTick of the bot
		var startAIAt;
		if(config.connect.proxyServer==true){
			startAIAt = 'spawn';
			print.say('Waiting for proxy server...'.yellow)
		}else startAIAt = 'physicTick';



		bot.once(startAIAt, () => {
		
			print.say(("Connected and spawned in server! Running Minecraft version: "+bot.version).green);
			
			//Set bot physics from config 
			
			for(property in config.physics){
				bot.physics[property] = parseFloat(config.physics[property]);
			}
			
			// Get minecraft data based on version 
			const mcData = require('minecraft-data')(bot.version)

			// Create movements for the Bot
			defaultMove = new Movements(bot, mcData)
			bot.pathfinder.setMovements(defaultMove)
			
			print.say("Initializing bot events".yellow);
			
			
			
			/*print.say("Detecting which AI to use based on bot location.".yellow);
			const aiSet = aiControl.checkAI(bot);
			print.shout("Running AI module ".green + aiSet.red);
			ai[aiSet].start(bot);
			print.say("Setting bot events to AI module's events".yellow);		
			bot_set_events(aiSet);
			print.say(("Starting AI brain, thinking every ").yellow+config.ai.thinkInterval+'ms');
			var aiThink = ai[aiSet].think;
			
			//This is a timeout instead of a set interval so that the think interval can be dynamically changed
			const aiBrain = function(){
				setTimeout(function(){
					aiThink(bot);
					aiBrain();
				},config.ai.thinkInterval);
			}
			aiBrain();*/
	

		
		});

	});


}

detect_food=function(){
	if(check_inventory('porkchop')!=0){
		return('porkchop');
	}else if(check_inventory('mutton')!=0){
		return('mutton');
	}
			
}


