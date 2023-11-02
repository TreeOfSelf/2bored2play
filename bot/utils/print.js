const Vec3 = require('vec3');

//Print text only if verbose is 3
annoy = function(text){
	if(config.ai.verbose>2){
		console.log(text);
	}
}

//Print text only if verbose is 2
say = function(text){
	if(config.ai.verbose>1){
		console.log(text);
	}
}

//Print text only if verbose is 1
shout = function(text){
	if(config.ai.verbose>0){
		console.log(text);
	}
}

//Turn vector into string coordinates
coords = function(vector){
	vector = vector.clone().floored();
	return(vector.x+','+vector.y+','+vector.z);
}


module.exports = {
	say,
	shout,
	annoy,
	coords,
};