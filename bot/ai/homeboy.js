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

var gotoX=57600
var gotoZ=-57600

var bot = {};

//Ran when AI is started 
function start(botInput){

	setTimeout(function(){
		
		
	bot = botInput;
	bot.loadPlugin(pathfinder);

	bot.controlState.sneak=false
	const mcData = require('minecraft-data')(bot.version)
	const defaultMove = new Movements(bot, mcData)
	
	bot.physicsEnabled=true;	
	
	bot.pathfinder.setMovements(defaultMove)
	bot.controlState.sprint=false;
	//bot.entity.position.y+=1;
	setInterval(function(){
	
	if(bot.controlState==null) return;
	
	
	
	const nearestPig = bot.nearestEntity(({ name }) => name === 'zombified_piglin')

	if(nearestPig /*&& bot.canSeeBlock(bot.blockAt(nearestPig.position))*/){
		let dist = calculateDistanceThree(nearestPig.position,bot.entity.position);

		if(dist<4){
			//bot.lookAt(nearestPig.position.offset(0,1.2,0));
			bot.attack(nearestPig);
		}
	}
	
	
	const nearestPlayer = bot.nearestEntity(({ type }) => type === 'player')
	
	if(nearestPlayer){
	
		//bot.lookAt(nearestPlayer.position.offset(0,1.3,0));
		let dist = calculateDistance(nearestPlayer.position,bot.entity.position);
		
		
		if(dist<0.5 && Math.abs(nearestPlayer.position.y-bot.entity.position.y)<1.2){
			
			
			

		let offset = nearestPlayer.position.offset(0,0.03,0).subtract(bot.entity.position).scaled(0.5);
		bot.entity.velocity = offset.scaled(-1);
		//console.log(bot.entity.velocity);
		}
		
		if(nearestPlayer.username == "gavain788" && dist > 5){
			//bot.pathfinder.setGoal(new GoalNear(nearestPlayer.position.x, nearestPlayer.position.y, nearestPlayer.position.z, 5))
		}
	}
	
	if(bot.food<18){
		bot.activateItem();
	}
	
	},500);
	
	
	},3000);
}



//Ran each think interval
let lastPos = null;
let randTick=0;

function think(bot){

}

function physicTick(){
	

}

function spawn(){

}

function move(){
	//Draw path to goal
}



function path_update(result){
	

}

function goal_reached(goal){

}



function death(){
	console.log('BOT DIED FOR SOME REASON');
}

function health(){
	console.log("Health: ",bot.health);
	console.log("Food: ",bot.food);
}


module.exports = {
	start,
	think,
	physicTick,
	move,
	spawn,
	path_update,
	death, 
	health,
};





function calculateDistance(p1, p2) {
    var a = p2.x - p1.x;
    //var b = p2.y - p1.y;
    var b  = 0;
	var c = p2.z - p1.z;

    return Math.sqrt(a * a + b * b + c * c);
}


function calculateDistanceThree(p1, p2) {
    var a = p2.x - p1.x;
    var b = p2.y - p1.y;
	var c = p2.z - p1.z;

    return Math.sqrt(a * a + b * b + c * c);
}