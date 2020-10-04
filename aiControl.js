const dist = require(pathRoot + '/utils/distance.js');
const Vec3 = require('vec3');


//Check to see where the AI is and run the proper AI

function checkAI(botInput){
	
	//Save reference to bot 
	const bot = botInput;
	
	//Check to see if the bot is in the nether based on the nearby blocks to be safe we check a lot of blocks
	var checkNether =  bot.findBlocks({
		matching : function(block){
			if(block){
				return true;
			}
		},
		maxDistance: 5,
		count : 30,
	});

	

	//Loop through block list to see if any of the blocks are in a nether biome 
	for(var k =0; k<checkNether.length ; k++){
		checkNether[k] = bot.blockAt(checkNether[k]);
		if(checkNether[k].biome.name=='Hell'){
			return('nether');
			break;
		}
	}
	
	//If no nether blocks are detected, we check to see if we are close to spawn in the overworld
	//Check the bots distance from the center of the world to determine if he needs to escape or prosper
	if(dist.two(dist.worldCenter,bot.entity.position)>global.config.escapeSpawn.safeDistance) return('prosper'); else return('escapeSpawn');
			
}

module.exports = {
	checkAI,
};






