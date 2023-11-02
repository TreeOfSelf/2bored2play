/*
AI directives:

-Get to escape distance 
-Use nearby nether portlas 


*/
const path = require('path');
let utilPath = path.join(__dirname, '..');
const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalInvert, GoalFollow } = require(utilPath+'/utils/pathfinder').goals;
const { pathfinder, Movements } = require(utilPath+'/utils/pathfinder');

const print = require(utilPath+'/utils/print.js')
const dist = require(utilPath+'/utils/distance.js');
const dir = require(utilPath+'/utils/direction.js');
const find = require(utilPath+'/utils/find.js');
const moveTo = require(utilPath+'/utils/move.js');
const Vec3 = require('vec3');

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

	bot.loadPlugin(pathfinder)
	const mcData = require('minecraft-data')(bot.version)
	const defaultMove = new Movements(bot, mcData)	
	bot.pathfinder.setMovements(defaultMove)
	setTimeout(function(){
		moveAway(bot.entity.position);
	},5000);

	
}



//Ran each think interval
let lastPos = null;
let randTick=0;

function think(bot){
	console.log('thought',bot.targetDigBlock);
	if(lastPos==null){
		lastPos = new Vec3(bot.entity.position.x,bot.entity.position.y,bot.entity.position.z);
	}else if(bot.targetDigBlock==null){
		if(dist.three(lastPos,bot.entity.position)<2){
			randTick++;
			moveRandom();
			setTimeout(function(){
			bot.controlState.jump=true;
			},500);

		}
	}
	
	var possibleDig = bot.findBlock({
		matching : [3,2,12,13,17,19,54,58,60,5],
		maxDistance : 2,
	});
	if(possibleDig){
		console.log('POSSIBLE DIG');
		bot.dig(possibleDig,false,function(){
			
		});
	}
}

function physicTick(){

}

function spawn(){
	const botPos = bot.entity.position;
	
	print.annoy("Escaping spawn from ".yellow+print.coords(botPos));
	print.annoy("Distance til escaped: ".yellow+(global.config.escapeSpawn.safeDistance-dist.two(dist.worldCenter,botPos)).toFixed(2));
	setTimeout(function(){
		moveAway(bot.entity.position);
	},5000);
}

function move(){
	//Draw path to goal
}

var tick=0

function path_update(result){
	
	console.log("Path length: "+result.path.length);
	//If we can not find a path in our current direction;
	if( (result.path.length==0 || result == null) && bot.targetDigBlock==null ){
			bot.controlState.jump=true;
			tick++
			if(tick<5){
			moveAway();
			}else{
			moveRandom();
			}
	}else{
		tick=0;
	}
}

function goal_reached(goal){
	//Check if we actually reached out goal and switch up direction if not
	if(dist.two(bot.entity.position,goal)>2){
		//moveRandom();
	}
}



function death(){
	print.say("Died at ".red+print.coords(bot.entity.position));
}

function goal_reset(){
	
	//moveRandom();
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
	bot.targetDigBlock=null;
	const goal = dir.determine(bot.entity.position);
	print.annoy("Moving towards ".yellow + print.coords(goal));
	bot.pathfinder.setGoal(new GoalXZ(goal.x,goal.z));
}

//Move in a random direction
function moveRandom(){
	if(bot.goal==null){
		bot.goal={
			x: Math.random()*10000,
			y: Math.random()*10000,
			z : Math.random()*10000,
		}
	}
	const goal = dir.random(bot.entity.position,bot.goal);
	print.annoy("Can't go any further this way. Moving towards ".yellow + print.coords(goal));
	bot.pathfinder.setGoal(new GoalXZ(goal.x,goal.z));	
	setTimeout(function(){
		bot.controlState.jump=true;
	},1000);
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