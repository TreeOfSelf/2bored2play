const myRL = require('serverline')
const print = require('./print.js');


//Clear console and initialize the server line input 
//this allows you to type commands into the server 
process.stdout.write('\x1Bc')

myRL.init({
	prompt : '<'.green,
	colorMode : true,
})

var completionArray = ['/help','/view','/kill','/pos','/startProxy','/startBot','/ai (name)'];
var helpArray = ["Displays a list of commands.",
"Starts the web viewer if it is not running.",
"Kills the bot.",
"States the bots current coordinates.",
"Starts the proxy",
"Starts the bot",
"Start a certain AI",
]; 
myRL.setCompletion(completionArray);


function run_cmd(cmd){
	cmd = cmd.split(" ");
	switch(cmd[0]){
		default:
			return("Unknown command. Type /help for a list of available commands.".red);
		break;
		case "ai":
			return(global.rootEval('bot_change("'+cmd[1]+'")'));
		break;
		case 'help':
			var helpList = "";
			for(var k = 0; k<completionArray.length; k++){
				helpList+=completionArray[k].brightGreen;
				if(helpArray[k]!=null){
					helpList+=' - '+helpArray[k].cyan+'\n';
				}
			}
			return(helpList);
			
		break;
		case 'view':
			if(bot!=null){
			if(config.viewer.enabled==false){
				global.rootEval("mineflayerViewer(bot, { firstPerson : config.viewer.firstPerson , follow : config.viewer.follow, port: 3001 })");
				config.viewer.enabled=true;
				return("Starting viewer".yellow);
			}else{
				return("Viewer is already started!".red);
			}
			}else{
				return("Bot is not started!".red);
			}
		break;
		case 'kill':
			if(bot!=null){
			global.rootEval("bot.chat('/kill')");
			return("Killing bot".red);
			}else{
				return("Bot is not started!".red);
			}
		break;
		case 'pos':
			if(bot!=null){
			return(global.rootEval("print.coords(bot.entity.position)"));
			}else{
				return("Bot is not started!".red);
			}
		break;
		case 'startProxy':
			return(global.rootEval('startProxy()'));
		break;
		case 'startBot':
			return(global.rootEval('startBot()'));
		break;
	}
}


/*Add any object keys that will spam the console here so that when the are displayed by the read line they show a simpler value 
for example, instead of displaying all of the websocket properties, we simply return the ready state. 
*/
function filter(key,value){
	switch(key){
		default:
			return value;
		break;
		case 'ws':
			return value.readyState;
		break;
	}
}


//This is ran when anything is entered into the line input 
myRL.on('line', function(line) {
	//Check if it is a command
	if(line[0]=='/'){
		line = line.replace('/','');
		var result = run_cmd(line);
		if(result!=null){
			console.log(result);
		}
	//If it is not a command run it as code
	}else{
		try {
			var result = global.rootEval(line);
			if(result!=null){
				if(typeof result != 'object'){
					console.log(result.toString().bold.brightRed);
				}else{
					console.log((JSON.stringify(result,filter,4)).bold.cyan);
				}
			}
		} catch(e){
			//Only display the first line of the error
			console.log((e.toString().split('\n')[0]).red);
		}	
	}
});

//Display introduction 

console.log(`Welcome to 2bored2play v0.0.2
Type /help to display built in commands. You can also press tab. 
Typing commands without a slash will execute it as code.`.brightGreen);
console.log("Sebastian Frederick 2020".trap.rainbow);

module.exports = {

};