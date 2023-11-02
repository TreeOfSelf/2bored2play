

function block(name,dist=16,amount=1,pos){

	let match = function(block){
		return(name.has(block.name));
	}		
	
	//Check if we have just a single block name
	if(!Array.isArray(name)){
		match = function(block){
			return(block.name==name);
		}
	}
	
	
	//Check if we are searching for a single or multiple blocks
	if(amount>1){
		return(this.bot.findBlocks({
			matching : match, 
			maxDistance : dist,
			count : amount,
			pos : pos,
		}));		
	} else {
		return(this.bot.findBlock({
			matching : match, 
			maxDistance : dist,
			count : 1,
			pos : pos,
		}));
	}
}



module.exports = {
	block,
}


