/*
██████╗ ██████╗  ██████╗ ██████╗ ███████╗██████╗ ██████╗ ██████╗ ██╗      █████╗ ██╗   ██╗
╚════██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝██╔══██╗╚════██╗██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝
 █████╔╝██████╔╝██║   ██║██████╔╝█████╗  ██║  ██║ █████╔╝██████╔╝██║     ███████║ ╚████╔╝ 
██╔═══╝ ██╔══██╗██║   ██║██╔══██╗██╔══╝  ██║  ██║██╔═══╝ ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  
███████╗██████╔╝╚██████╔╝██║  ██║███████╗██████╔╝███████╗██║     ███████╗██║  ██║   ██║   
╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   

A utility created for hosting a proxy to create a stable connection between a server and client
as well as botting and mapping features by

  ██████ ▓█████  ▄▄▄▄    ▄▄▄        ██████ ▄▄▄█████▓ ██▓ ▄▄▄       ███▄    █ 
▒██    ▒ ▓█   ▀ ▓█████▄ ▒████▄    ▒██    ▒ ▓  ██▒ ▓▒▓██▒▒████▄     ██ ▀█   █ 
░ ▓██▄   ▒███   ▒██▒ ▄██▒██  ▀█▄  ░ ▓██▄   ▒ ▓██░ ▒░▒██▒▒██  ▀█▄  ▓██  ▀█ ██▒
  ▒   ██▒▒▓█  ▄ ▒██░█▀  ░██▄▄▄▄██   ▒   ██▒░ ▓██▓ ░ ░██░░██▄▄▄▄██ ▓██▒  ▐▌██▒
▒██████▒▒░▒████▒░▓█  ▀█▓ ▓█   ▓██▒▒██████▒▒  ▒██▒ ░ ░██░ ▓█   ▓██▒▒██░   ▓██░
▒ ▒▓▒ ▒ ░░░ ▒░ ░░▒▓███▀▒ ▒▒   ▓▒█░▒ ▒▓▒ ▒ ░  ▒ ░░   ░▓   ▒▒   ▓▒█░░ ▒░   ▒ ▒ 
░ ░▒  ░ ░ ░ ░  ░▒░▒   ░   ▒   ▒▒ ░░ ░▒  ░ ░    ░     ▒ ░  ▒   ▒▒ ░░ ░░   ░ ▒░
░  ░  ░     ░    ░    ░   ░   ▒   ░  ░  ░    ░       ▒ ░  ░   ▒      ░   ░ ░ 
      ░     ░  ░ ░            ░  ░      ░            ░        ░  ░         ░ 
              
*/



//Don't stop on error 
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});


//Main Requires
const fs = require('fs');
const path = require('path');
const ini = require('ini');


//These are global because they may need to be accessed often by other modules 
global.config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))


//This is somewhat handy, but bad practice. It allows other modules to run code and return results at this level. 
global.rootEval = function(cmd){
	var result = eval(cmd);
	if(typeof result == 'object') console.log(result); else return(result);
	
};


//Requires

const colors = require('colors');
const cmd = require('./cmd/cmd.js');
const { fork } = require('child_process');






//Get account information
fs.accessSync("./"+config.proxy.details+".json", fs.constants.R_OK);
var secrets = require('./'+config.proxy.details+'.json');



//Definitions 

//Contains reference to the proxy process 
var proxy = null;
//Bot process 
var bot = null;

function startProxy(){
	proxy = fork('./proxy/proxy.js');
	proxy.send({name : 'start',config : config,secrets : secrets,});
	proxy.on('message',(msg) => {
		switch(msg[0]){
			case "bot_restart":
				if(bot==null){
					startBot();
				}
				if(bot.killed != null && bot.killed!=true){
					bot.send({name : 'end'});
				}
				startBot();
			break;
			case "bot_end":
				if(bot!=null){
					bot.send({name : 'end'});
					bot.kill();
				}
			break;
		}
	});
	return('Proxy started!'.lightGreen);
}
function pause_client(id){
	proxy.send({
		name : "pause",
		pause : id,
	});
}

function bot_change(aiType){
		config.ai.start=aiType;
		startBot();
}


function startBot(){
	if(bot!=null){
		bot.kill();
	}
	bot = fork('./bot/bot.js');
	bot.send({name : 'start',config : config,secrets : secrets,});
	bot.on('message',(msg) => {
		switch(msg[0]){
			case "bot_restart":
				startBot();
			break;
			case "proxy_restart":

				proxy.kill();
				proxy=null;
				bot.kill();
				bot=null;
				console.log("GLITCH DETECTED, RESTARTING".red);
				setTimeout(function(){
					startProxy();
				},10000);
			break;
	
		}
	});
	return('Bot started!'.lightGreen);
}
