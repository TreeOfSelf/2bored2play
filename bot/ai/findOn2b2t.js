/*
AI directives:

-Find skeleton spawners close together

C:\Tools\testServer\world\region

*/
const path = require('path');
let utilPath = path.join(__dirname, '..');
const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalInvert, GoalFollow } = require(utilPath+'/utils/pathfinder').goals;
const print = require(utilPath+'/utils/print.js')
const dist = require(utilPath+'/utils/distance.js');
const dir = require(utilPath+'/utils/direction.js');
const find = require(utilPath+'/utils/find.js');
const moveTo = require(utilPath+'/utils/move.js');
const fs = require('fs');
const mcData = require('minecraft-data')('1.12.2')
var bot = {};
var readyCheck = 0;

//Ran when AI is started 
function start(botInput){
	bot = botInput;
	bot._events.physicTick=[];
	
	//Connect bot to modules
	find.bot = bot;
	move.bot = bot;
	
	//Set variables based on config 
	bot.sprint = config.escapeSpawn.sprint;
	bot.chat('/gamemode 1 bot');
	bot.creative.startFlying()
	setTimeout(function(){
		search();
	},500);

}

//Ran each think interval
function think(bot){
	
}

function physicTick(){

}

function spawn(){

}

function move(){

}

var tick=0;

function path_update(result){

}

function goal_reached(goal){

}


function death(){

}

function goal_reset(){

}

                //ENCHANTEDBOOK       //GAPPLE       //DIAMOND ARMOR       //BANNER
var dankLoot = [403                  ,322,         310,311,312,313,     	425];
var lootList = "";
var tries =0;
function move(){
	
}
function forcedMove(){
	//checkChest();
}

giveUpTimeout=null;
checkTimeout=null;
function search(){
	
	//Select random position 
		
	delete_regions();

	//Teleport to

	//bot.entity.position.x=randX;
	//bot.entity.position.z=randZ;

	clearTimeout(checkTimeout);
	checkTimeout = setTimeout(function(){
		print.say("Checking: "+bot.entity.position.x+','+bot.entity.position.z);
		//Find mob spawners
		var dankList = bot.findBlocks({
					//skele //end //boneblock //woodland   //chest     //emerald ore
			//matching : [52,119,120,216,      57,         54,           	129],
			//matching:[216,54],
			//matching: [52,54,216],
			matching: 52,
			maxDistance : 600,
			count : 100,
		});

		
		//Convert 
		var woodHit=0;
		var endHit=0;
		var boneHit=0;
		let prunedSpawnerList=[];
		let prunedChestList=[];
		let emeraldList=[];
		let prunedBoneList=[];
		for(var k=0; k<dankList.length; k++){
			var block = bot.blockAt(dankList[k]);
			//Check if its a skeleton spawner if so add it to new list
			if( block.type == 52){
				
				prunedSpawnerList.push(dankList[k]);
			}
			if((block.type == 119 || block.type == 120) && endHit==0){
				endHit=1;
				fs.appendFileSync('./endPortals.txt',JSON.stringify(dankList[k])+'\n');
			}
			if(block.type == 57 && woodHit==0){
				woodHit=1;
				fs.appendFileSync('./woodLandSpawns.txt',JSON.stringify(dankList[k])+'\n');
			}
			if(block.type == 216){
				prunedBoneList.push(dankList[k]);
			}
			if(block.type == 54){
				prunedChestList.push(dankList[k]);
			}
			if(block.type == 129){
				emeraldList.push(dankList[k]);
			}
		}
		
		if(emeraldList.length>=48){
			fs.appendFileSync('./emeraldCluster.txt',JSON.stringify(emeraldList[0])+' count: '+emeraldList.length+'\n');
		}
		
		if(prunedBoneList.length>0){
				fs.appendFileSync('./boneBlocks.txt',JSON.stringify(prunedBoneList[0])+' count:'+prunedBoneList.length+'\n');
			
		}
		
		//block.blockEntity.SpawnData.id.search("skeleton")!=-1
		var skeleHit=-1;
		for(var k=0; k<prunedSpawnerList.length; k++){
			var block = bot.blockAt(dankList[k]);
			if(block.blockEntity.SpawnData.id.search("skeleton")!=-1){
				skeleHit=k;
			}
		}
		
		
		console.log(prunedSpawnerList.length);
		
		
		if(prunedSpawnerList.length>1 && skeleHit!=-1){
			var hit=0;
			for(var k=0; k<prunedSpawnerList.length; k++){

						if(dist.three(prunedSpawnerList[k],prunedSpawnerList[skeleHit])<=30){
							hit=1;
							console.log('Possible find! :'+JSON.stringify(prunedSpawnerList[k]).green+','+dist.three(prunedSpawnerList[k],prunedSpawnerList[skeleHit]).toString().red);
							console.log(prunedSpawnerList[k]);
							fs.appendFileSync('./easyXP.txt',
							JSON.stringify(prunedSpawnerList[k])+
							'\n'
							);
						}
					
				
			}
			if(hit==1){
				fs.appendFileSync('./easyXP.txt',
							'--------------------'+
							'\n');
			}
		}
		
		/*
		OLD SEARCH
		for(var k=0; k<prunedSpawnerList.length; k++){
			for(var l=0; l<prunedSpawnerList.length; l++){
				//Dont compare the same spawner to itself
				if(l!=k){
					if(dist.three(prunedSpawnerList[k],prunedSpawnerList[l])<=30){
						console.log('Possible find! :'+JSON.stringify(prunedSpawnerList[k]).green+','+dist.three(prunedSpawnerList[k],prunedSpawnerList[l]).toString().red);
						console.log(prunedSpawnerList[k]);
						fs.appendFileSync('./easyXP.txt',
						JSON.stringify(prunedSpawnerList[k])+
						JSON.stringify(prunedSpawnerList[l])+
						'\n'+
						Math.round(dist.three(prunedSpawnerList[k],prunedSpawnerList[l]))+
						'\n'
						);
					}
				}
			}
		}
		
		*/
		
		if(prunedChestList.length<=0){

		search();
		
		}else{
			lootList="";
			getChestContents(prunedChestList);
			
		}
		
	},5000);
	let randX = /*(Math.random() < 0.5 ? -1 : 1)**/(Math.round(Math.random()*60000)+580000);
	let randZ = /*(Math.random()< 0.5 ? -1 : 1)**/(-Math.round(Math.random()*60000)-490000);
	bot.chat('/tp gavain788 '+randX+' 50 ' +randZ);
}

function delete_regions(){
	fs.readdirSync('C:/Tools/testServer/world/region').forEach(function(file) {
		fs.unlink('C:/Tools/testServer/world/region/'+file,function(){});
	});	
}

var saveChest=null;
var saveChestList=null;
var doChest=null;
function getChestContents(chestList){
	if(chestList.length>0){
		var chest = chestList.pop();
		bot.chat('/tp '+(chest.x+1)+' '+(chest.y)+' '+(chest.z+1));
		saveChest = chest;
		saveChestList=chestList;

		doChest=setTimeout(function(){
			checkChest();
		},30);
	}else{

		search();
	}

	
}


function checkChest(){
if(saveChest!=null && saveChest.x!=null){
		clearTimeout(doChest);
		setTimeout(function(){
		let chest = saveChest;
		let chestList = saveChestList;
		

		clearTimeout(giveUpTimeout);
		giveUpTimeout=setTimeout(function(){
		
				
			saveChest=null;
			saveChestList=null;
			getChestContents(chestList);	
			

		},1000)
		
		chestObj = bot.openChest(bot.blockAt(chest));
		lootList="";
		chestObj.on('open',function(){
			clearTimeout(giveUpTimeout);
			var itemList=[];
			setTimeout(function(){
			itemArray = chestObj.items();
			console.log(itemArray);
			for(var x=0; x<itemArray.length;x++){
				let item = itemArray[x];
				if(dankLoot.indexOf(item.type)!=-1){
					switch(item.type){
						default:
							console.log('DIAMOND',item);
						break;
						case 425:
							lootList+=" BANNER";
						break;
						case 403:
							var enchantStr = "";
							for(var k=0;k<item.nbt.value.StoredEnchantments.value.value.length;k++){
								let enchant = item.nbt.value.StoredEnchantments.value.value[k];
								let enchantName = mcData.enchantments[enchant.id.value].name
								let enchantLevel = enchant.lvl.value;
								
								if(enchantLevel>=3 || 
								enchantName=="mending" ||
								enchantName == "frost_walker" ||
								(enchantLevel>=2 && enchantName=="looting") ||
								(enchantLevel>=2 && enchantName=="fire_aspect")){
									enchantStr+=' '+enchantName+':'+enchantLevel	
								}
							}
							if(enchantStr!=""){
								lootList+='['+enchantStr+']';
							}
						break;
						case 322:
							if(item.displayName.search("Enchanted")!=-1){
								lootList+=" GAPPLE";
							}
						break;
					}
				}
			}
			if(lootList!=""){
				fs.appendFileSync('./chestLoot.txt',(JSON.stringify(chest))+'\n'+lootList+'\n');
				console.log(chest,lootList);
			}else{
				console.log("no dank :(".red);
				
			}
			tries=0;
			getChestContents(chestList);
			saveChest=null;
			saveChestList=null;
			},50);
			
		});
		},500);
	}else{
		search();
	}
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
	forcedMove,
};


//Move away from spawn 
