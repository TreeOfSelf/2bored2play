/*
AI directives:

-Get to escape distance 
-Use nearby nether portlas 


*/
const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalInvert, GoalFollow } = require(pathRoot+'/utils/pathfinder').goals;
const print = require(pathRoot+'/utils/print.js')
const dist = require(pathRoot+'/utils/distance.js');
const dir = require(pathRoot+'/utils/direction.js');
const find = require(pathRoot+'/utils/find.js');
const moveTo = require(pathRoot+'/utils/move.js');

var bot = {};

//Ran when AI is started 
function start(botInput){
	bot = botInput;
	
	//Connect bot to modules
	find.bot = bot;
	move.bot = bot;
	
	//Set variables based on config 
	bot.sprint = config.escapeSpawn.sprint;
	//Move away from spawn
	moveAway(bot.entity.position);
}

//Ran each think interval
function think(bot){
	
}

function physicTick(){

}

function spawn(){
	const botPos = bot.entity.position;
	
	print.annoy("Escaping spawn from ".yellow+print.coords(botPos));
	print.annoy("Distance til escaped: ".yellow+(global.config.escapeSpawn.safeDistance-dist.two(dist.worldCenter,botPos)).toFixed(2));
	moveAway(botPos);	
}

function move(){
	//Draw path to goal
	bot.viewer.drawLine('direction', [this.entity.position,bot.goal],0x00ff00);
}

var tick=0;

function path_update(result){
	//If we can not find a path in our current direction;
	if(result.path.length==0 || result == null ){

			moveRandom();
			tick=0;
		
	}else{
		bot.viewer.drawLine('path',result.path,0x54fce6,5);
	}
}

function goal_reached(goal){
	//Check if we actually reached out goal and switch up direction if not
	if(dist.two(bot.entity.position,goal)>2){
		moveRandom();
	}
}


function death(){
	print.say("Died at ".red+print.coords(bot.entity.position));
}

function goal_reset(){
	moveRandom();
}


module.exports = {
	start,
	think,
	physicTick,
	move,
	spawn,
	path_update,
	goal_reached,
	goal_reset,
	death, 
};


//Move away from spawn 
function moveAway(botPos){
	//Get direction to go in
	const goal = dir.determine(bot.entity.position);
	print.annoy("Moving towards ".yellow + print.coords(goal));
	bot.pathfinder.setGoal(new GoalXZ(goal.x,goal.z));
}

//Move in a random direction
function moveRandom(){
	const goal = dir.random(bot.entity.position,bot.goal);
	print.annoy("Can't go any further this way. Moving towards ".yellow + print.coords(goal));
	bot.pathfinder.setGoal(new GoalXZ(goal.x,goal.z));		
}

//Find nearby water
function checkWater(cb){
	const water = find.block('water',200);
	if(water){
		bot.lookAt(water.position,false,function(){
			if(bot.canSeeBlock(water)){
				cb(water);
			}else{
				cb();
			}
		})
	}else{
		cb();
	}
}