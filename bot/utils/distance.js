function nearestEntity(entities)
{
    var r=entities.reduce(function(acc,entity)
    {
        var d=entity.position.distanceTo(bot.entity.position);
        if(d<acc[1])
        {
            acc[0]=entity;
            acc[1]=d;
        }
        return acc;
    },[null,1000000]);
    return r[0];
}

check_inventory=function(item){
	var total=0;
	for(var k =0;k<bot.inventory.slots.length;k++){

		
		slot = bot.inventory.slots[k];
		if(slot!=null){
			if(slot.name.search(item)!=-1){
				total+=slot.count;
			}
		}
	}
	return(total);
}

move_random=function(){
	gotoX=Math.random()*50000 - Math.random()*50000;
	gotoZ=Math.random()*50000 - Math.random()*50000;
	bot.pathfinder.setGoal(new GoalXZ(gotoX,gotoZ))
	pathed=1
}

get_inventory=function(item){
	for(var k =0;k<bot.inventory.slots.length;k++){

		
		slot = bot.inventory.slots[k];
		if(slot!=null){
			if(slot.name.search(item)!=-1){
				return(slot);
			}
		}
	}
}


//Distance in three dimensions 
function three(v1, v2 )
{

    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

//Check distance in three dimensions based on X/Y/Z difference in numerical value 
function three_fixed(v1, v2 )
{
    return(
	Math.abs(v1.x-v2.x)+
	Math.abs(v1.y-v2.y)+
	Math.abs(v1.z-v2.z)
	);
}


function two(p1,p2){
	var dx = p2.x-p1.x;
	var dy = p2.z-p1.z;
	return Math.sqrt(dx*dx + dy*dy);
}

function two_fixed(v1,v2){
    return(
	Math.abs(v1.x-v2.x)+
	Math.abs(v1.z-v2.z)
	);
}

//Center of world 
const worldCenter = {
	x : 0,
	y : 0,
	z : 0,
}

module.exports = {
	two,
	two_fixed,
	three,
	three_fixed,
	worldCenter,
};
