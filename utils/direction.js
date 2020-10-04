const Vec3 = require('vec3');

//Determine best direction to run out towards depending on current coordinates 
function determine(position){

	let goalX = 1;
	let goalZ = 1;
	
	if(position.x < 0 ){
		goalX*=-1;
	}
	if(position.z < 0){
		goalZ*=-1;
	}
	
	let ratio = Math.abs(position.x)/Math.abs(position.z);
	
	goalX *= ratio;
	goalZ /= ratio;
	
	goalX*=config.escapeSpawn.safeDistance;
	goalZ*=config.escapeSpawn.safeDistance;
	
	return(new Vec3(goalX,position.y,goalZ));
}


//Points in a random direction
function random(position,goal){

	const ratioAmount = Math.random();
	
	let goalX,goalZ;
	
	switch(Math.round(Math.random()*2)){
		case 0:
			goalX = -goal.x
			goalZ = -goal.z
		break;
		case 1:
			goalX = goal.x
			goalZ = -goal.z
		break;
		case 2:
			goalX = -goal.x
			goalZ = goal.z
		break;
	}
	

	
	return(new Vec3(goalX,position.y,goalZ));
	
}

module.exports = {
	determine,
	random,
}