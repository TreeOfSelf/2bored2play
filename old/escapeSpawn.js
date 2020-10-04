const { pathfinder, Movements } = require('mineflayer-pathfinder');
const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals;


exports.start = function(){

	console.log('Escaping spawn!');
	clear_events();
	if(aiLogic !=  null){
		clearInterval(aiLogic);
	}

	var lastLoc = new Vec3(0,60000,0);
	deathCount = 0;
	var randHit = 0;

	aiLogic = setInterval(function(){
		aiThink();
	},100);



	  bot.on('path_update', (r) => {
		if(r.path.length!=0){
			stagnant=0;
			const nodesPerTick = (r.visitedNodes * 50 / r.time).toFixed(2)
			console.log(`I can get there in ${r.path.length} moves. Computation took ${r.time.toFixed(2)} ms (${nodesPerTick} nodes/tick).`)
		}else if(inPortal==false){
			deathCount+=10
			console.log(deathCount);
		}
	  })

	lastPos = bot.entity.position.clone();
	parkourReady=false;
	bot.on('physicTick',() =>{
			bot.setControlState("jump",bot.entity.isInWater);
			
			/*var diff = Math.abs(lastPos.x  -bot.entity.position.x) + Math.abs(lastPos.z - bot.entity.position.z)
			lastPos.x = bot.entity.position.x;
			lastPos.z = bot.entity.position.z;
			if(diff<0.002){
				parkourReady=true
			}else{
				parkourReady=false;
			}
					
			var block = bot.blockAt(bot.entity.position.offset(0,-1,0))

			
			if(block!=null && block.boundingBox=='block' && bot.entity.isCollidedVertically==true && bot.blockAt(bot.entity.position).name=='air'){
			
			//if(bot.controlState.forward==false){
			bot.entity.velocity.x*=0.95
			bot.entity.velocity.z*=0.95
			//}
			
				if(gotoX>=0){
					gotoXX = 1;
				}else{
					gotoXX = -1;
				}
				
				if(gotoZ>=0){
					gotoZZ = 1;
				}else{
					gotoZZ = -1
				}
				
				var cornerBlock = bot.blockAt(block.position.offset(gotoXX,1,gotoZZ))
				if(cornerBlock == null || cornerBlock.boundingBox!='block'){
					var cornerBlock = bot.blockAt(block.position.offset(gotoXX,2,gotoZZ))
				}

				if(gotoX>=0){
					var blockX = bot.blockAt(block.position.offset(1,1,0))
					var blockXX = bot.blockAt(block.position.offset(1,2,0))
					if( (blockX!=null && blockX.boundingBox=='block') ||( blockXX!=null && blockX.boundingBox=='block') || (cornerBlock!=null && cornerBlock.boundingBox=='block')  ){
						offSetX = 0.7
					}else{
						offSetX = 0.9
					}
				}else{
					var blockX = bot.blockAt(block.position.offset(-1,1,0))
					var blockXX = bot.blockAt(block.position.offset(-1,2,0))
					if( (blockX!=null && blockX.boundingBox=='block') ||( blockXX!=null && blockX.boundingBox=='block') || (cornerBlock!=null && cornerBlock.boundingBox=='block')  ){
						offSetX = 0.3
					}else{
						offSetX = 0.0
					}
				}
				
				if(gotoZ>=0){
					var blockX = bot.blockAt(block.position.offset(0,1,1))
					var blockX = bot.blockAt(block.position.offset(0,2,1))
					if( (blockX!=null && blockX.boundingBox=='block') ||( blockXX!=null && blockX.boundingBox=='block') || (cornerBlock!=null && cornerBlock.boundingBox=='block')  ){
						offSetZ = 0.7
					}else{
						offSetZ = 0.9
					}
				}else{
					var blockX = bot.blockAt(block.position.offset(0,1,-1))
					var blockX = bot.blockAt(block.position.offset(0,2,-1))
					if( (blockX!=null && blockX.boundingBox=='block') ||( blockXX!=null && blockX.boundingBox=='block') || (cornerBlock!=null && cornerBlock.boundingBox=='block')  ){
						offSetZ = 0.3
					}else{
						offSetZ = 0.0
					}
				}
				


				bot.entity.position.x+=(block.position.x+offSetX - bot.entity.position.x )*0.07;
				bot.entity.position.z+=(block.position.z+offSetZ - bot.entity.position.z )*0.07;

			
			}*/
			parkourReady=true;
		
	})


	bot.on('spawn', () => {
	  deathCount=0;
	  randHit=0;
	  portals=[];
	 if(killTimeout!=null){
		 clearTimeout(killTimeout);
	 }
	 
	bot.clearControlStates();
	 portals=[];
	toPortal=false;
	 pathed=0;
	 inPortal=false;

		setTimeout(function(){
			if(toPortal==false){
				pathed=0;
			}
		},2500);
	 console.log('Spawned at: ',bot.entity.position.x,bot.entity.position.y,bot.entity.position.z);
	 /*if(bot.entity.position.y<20) {
		 if(killTimeout!=null){
			 clearTimeout(killTimeout);
		 }
		 killTimeout = setTimeout(function(){
			console.log('Killing myself!!!');
			bot.chat('/kill');
			killTimeout=null;
		 },3000);
	 }*/
	});



	bot.on('health', (e) => {
	  if(prevHealth!=bot.health){
		 prevHealth = bot.health;
		 const hostileFilter = (entity) => (entity.kind == 'Hostile mobs' || entity.type=='player')
		 const hostileEntity = bot.nearestEntity(hostileFilter)
		 if(hostileEntity!=null){
			console.log(bot.health,hostileEntity.name);
		 }
	  }


		
	});

	bot.on('forcedMove', ()=>{

	pathed=0;
	parkourSet=null;
	bot.clearControlStates();
	bot.entity.velocity.x=0;
	bot.entity.velocity.y=0;
	bot.entity.velocity.z=0;
	detectionModifier*=0.95;
	if(detectionTimeout!=null){
		clearTimeout(detectionTimeout);
	}
	detectionTimeout = setTimeout(function(){
		detectionModifier=0.9025;
	},2000);
	console.log('FORCED TO MOVE LOWERING DETECTION MOD TO '+detectionModifier);
	bot.clearControlStates();
	bot.pathfinder.setGoal(new GoalXZ(bot.entity.position.x,bot.entity.position.z));
	});


	bot.on('move', () => {
	  
	//console.log(bot.blockAt(bot.entity.position.offset(0,-0.7,0)).boundingBox)
	  
	 var block = bot.blockAt(bot.entity.position);
	 if(block!=null){
	if(bot.blockAt(bot.entity.position).name=='portal'){
		inPortal=true;
	}
	 }
	var pointOne = bot.entity.position.clone();
	pointOne.x = gotoX;
	pointOne.z = gotoZ;
	var pointTwo = bot.entity.position.clone();
	bot.viewer.drawLine('path', [pointOne,pointTwo],0x40EE28); 

	  
	 
	/* if( bot.entity.position.y<60){
		 if(killTimeout==null){
			 killTimeout = setTimeout(function(){
			if(toPortal==false){
			console.log('Ended up Too close to death pit in spawn Killing myself!!!');
			bot.chat('/kill');
			killTimeout=null;
			}
		 },3000);
		 }
	 }*/
	if(bot.entity.isInWater==true){
			bot.setControlState("jump",true);
			bot.setControlState('forward',true);
			bot.lookAt(new Vec3(gotoX,bot.entity.position.y,gotoZ) ,false,function(){});

	}

	});

	bot.on('goal_reached', (goal) => {
	 runFrom=-5;
	if(pathed==3){
		pathed=0;
	}
	if(pathed==2){
		pathed=3;
		setTimeout(function(){
		bot.pathfinder.setMovements(defaultMove)
		bot.pathfinder.setGoal(new GoalXZ(bot.entity.position.x+offSetVec.z*(100+Math.random()*50),bot.entity.position.z+-offSetVec.x*(10+Math.random()*30)));
		},250);
	}

	})

	bot.on('entityHurt', (entity,dmg) => {

	});


	aiThink=function(){



		if( bot.targetDigBlock==null){

		
		
		

			if( inPortal==false){

				if(distance_3d(lastLoc,bot.entity.position)<50){
				  deathCount+= (50-distance_3d(lastLoc,bot.entity.position))*0.1
				  if(deathCount>=1500 && (bot.entity.isCollidedVertically==true || bot.entity.isInWater==true)){
						randDir=true;
						setTimeout(function(){
							randDir=false;
						},60000);
						console.log('Attempting new direction for awhile, not worth jumping from here');
						gotoX=Math.random()*50000 - Math.random()*50000;
						gotoZ=Math.random()*50000 - Math.random()*50000;
						bot.pathfinder.setGoal(new GoalXZ(gotoX,gotoZ))
						pathed=1;
						randHit+=1;
						deathCount=0;	
						if(randHit>=3){
							randHit=0;
							console.log('I think I am stuck, I am killing myself');
							bot.chat('/kill')					
						}
				  }
		  
			  }else{
				  lastLoc = bot.entity.position.clone();
				  deathCount=0;
				  randHit=0;
			  }
			  

			
			
			if(  (bot.pathfinder.isThinking()==false && Math.abs(Math.round(lastPos[0]) - Math.round(bot.entity.position.x)) <1 &&  Math.abs(Math.round(lastPos[1]) - Math.round(bot.entity.position.y))<1 && Math.abs(Math.round(lastPos[2]) - Math.round(bot.entity.position.z))<1) || parkourSet!=null){
				
				
				stagnant+=1;
				if(stagnant>=10){
					if(toPortal==false){
						pathed=0;
					}else{
						if(netherPortal!=null){
						if( Math.abs(netherPortal.y-bot.entity.y)>30){
							if(netherTimeout!=null){
								clearTimeout(netherTimeout);
							}
								netherPortal=null;
								toPortal=false;
								console.log('that drop looks nasty not worth parkouring to');
								portals.push(netherPortal.position.clone())
								pathed=0;
						}else{
									if(stagnant>25){
										portals.push(netherPortal.position.clone())
									}
									netherPortal=null;
									toPortal=false;
							
						}
						}else{
							netherPortal=null;
						}
					}
					
					if(parkourSet==null){
						
						var checkDist = {
							x : gotoX,
							z : gotoZ,
						}
						var maxDist = 5;
						//Willing to jump down to a close portal 
						if(toPortal==true  && distance_2d(checkDist,bot.entity.position) && netherPortal.y<bot.entity.y){
							if(netherPortal==null){
								toPortal=false;
							}else{
								var maxDist = 20;
							}
						}
						
						
						var parkourJumpList = bot.findBlocks({
								matching : function(block){
									if(block.boundingBox=='block'){
										return true;
									}
								},
								maxDistance: maxDist,
								count : 400,
						});
						
						var testPos = {
							x : gotoX,
							z : gotoZ,		
						}				
						
						var curDist = 1000;
						
						for(var k=0;k<parkourJumpList.length;k++){
							var block = parkourJumpList[k];
							
							var blockCoordsAbove = block.clone();
							blockCoordsAbove.y+=1;
							
							var blockAbove = bot.blockAt(blockCoordsAbove);
							block.y+=1;
							block.x+=0.5;
							block.z+=0.5
							
							if(block.y<=bot.entity.position.y+1 

							&& (distance_2d(block,testPos)+0.5<distance_2d(bot.entity.position,testPos))
							 && blockAbove.boundingBox!='block'){
								var dist = distance_2d(block,bot.entity.position);
								if(dist<curDist){
									var parkourJump = block.clone();
									curDist=dist;
								}
							}
						}
						
					
					}else{
						parkourJump = parkourSet;
						parkourSet = null;
					}
					if(parkourJump!=null && parkourAttempts<=6 && bot.entity.isInWater==false && checkInterval==null){
							stagnant=0;parkourAttempts+=1;
							console.log('attempting parkour jump');console.log(bot.entity.position);console.log(parkourJump);
							console.log('DET MOD' +detectionModifier);
							bot.viewer.drawLine('jump', [parkourJump,bot.entity.position],0x00FFD8); 
							//var parkourOver = parkourJump.clone();parkourOver.y+=2;
							bot.lookAt(parkourJump,false,function(){
								if(bot.food>10){
								bot.setControlState("sprint",true);
								bot.entity.velocity.x += ((parkourJump.x- bot.entity.position.x)*0.08)*detectionModifier;
								bot.entity.velocity.z += ((parkourJump.z- bot.entity.position.z)*0.08)*detectionModifier;
								}
								
			
							
									bot.setControlState("jump",true);
								
								bot.setControlState("forward",true);
								
								if(distance_2d_fixed(parkourJump,bot.entity.position)<=3){
								bot.physics.sprintSpeed=1.3;
								}else{
									if(distance_2d_fixed(parkourJump,bot.entity.position)<=4){
										bot.physics.sprintSpeed=1.3;
									}else{
										if(bot.entity.position.y-2 <= parkourJump.y){
											bot.physics.sprintSpeed=1.3;
										}else{
											bot.physics.sprintSpeed=1.3;
										}
									}
								}
								
								if(parkourJump.y+0.5<bot.entity.position.y){
									bot.physics.sprintSpeed=1.3;
								}
								
								
								if(detectionModifier<1){
									console.log(detectionModifier,bot.physics.sprintSpeed);
								}
								

			
								var initDist = distance_2d(parkourJump,bot.entity.position)
								bot.entity.isCollidedVertically=false;
								
								checkInterval = setInterval(function(){
									var checkDist = distance_2d(parkourJump,bot.entity.position);

									if(checkDist>initDist+0.25 || bot.entity.isCollidedVertically==true){
										clearInterval(checkInterval);
										checkInterval=null;
										bot.physics.sprintSpeed=1.3;
										bot.entity.velocity.x=0;
										bot.entity.velocity.z=0;
										bot.clearControlStates()
										return;
									}		

									if(checkDist<=0.7 ){
					

										//bot.entity.velocity.x*=0.9;
									//	bot.entity.velocity.z*=0.9;

										//bot.clearControlStates()
									
									if(checkDist<=0.45 ){
						
										bot.entity.velocity.x=0;
										bot.entity.velocity.z=0;
										bot.entity.position.x = parkourJump.x;
										bot.entity.position.z = parkourJump.z;
										pathed=0;
										bot.clearControlStates()
										bot.physics.sprintSpeed=1.3;
										bot.pathfinder.setGoal(new GoalXZ(bot.entity.position.x,bot.entity.position.z));	
										clearInterval(checkInterval);
										checkInterval=null;
									}
									

									}
								},20);
								
		
							});			
									
								
							//}
						//});
					}else if(stagnant>50){
					

						  waterBlocks = bot.findBlocks({
								matching : function(block){
									if(block.name=='flowing_water' || block.name=='still_water' || block.name=='water' || block.type==9){
										return true;
									}
								},
								maxDistance: 300,
								count : 100,
							});
						


						var maxDist = 99999;
						waterBlock = null;
						
						for(var k=0; k < waterBlocks.length; k++){
							
							var distCheck = distance_3d(waterBlocks[k],bot.entity.position);
							if(distCheck >4 && waterBlocks[k].y < bot.entity.y){
								
								if(distCheck < maxDist){
								waterBlock = waterBlocks[k];
								maxDist = distCheck;
								}
								
						
							}
						}
						
						
						if(waterBlock!=null && bot.entity.isInWater==false && waterAttempts<=3){
						waterAttempts+=1;
						console.log('JUMPING INTO WATER DISTANCE: '+distance_3d(waterBlock,bot.entity.position));
						
						bot.viewer.drawLine('jump', [waterBlock,bot.entity.position],0x00FFD8); 
						bot.lookAt(waterBlock,false,function(){
							if(bot.food>10){
							bot.setControlState("sprint",true);
							}
							bot.setControlState("jump",true);
							bot.setControlState("forward",true);


						});
						
						}else{
							if(bot.entity.position.y<30){
							
								console.log('RANDOM JUMP CAUSE W/E');
								bot.lookAt(new Vec3(bot.entity.position.x+Math.random()*30-Math.random()*30,bot.entity.position.y+Math.random()*30-Math.random()*30,bot.entity.position.z+Math.random()*30-Math.random()*30),false,function(){
									if(bot.food>10){
									bot.setControlState("sprint",true);
									}
									bot.setControlState("jump",true);
									bot.setControlState("forward",true);
									
									
									xOff=0.03;
									zOff=0.03;
									if(bot.entity.position.x<0){
										xOff*=-1;
									}
									if(bot.entity.position.z<0){
										zOff*=-1;
									}
										
									bot.entity.position.y+=Math.random()*0.03;
									bot.entity.position.x+=Math.random()*xOff;
									bot.entity.position.z+=Math.random()*zOff;
									
								});
							}
								
							
						}

					}		
								
					
				}
			
		}else{
			parkourAttempts=0;
			waterAttempts=0;
			stagnant=0;
			lastPos = [bot.entity.position.x,bot.entity.position.y,bot.entity.position.z];
		}
	}


		}
		
		const nearFilter = (entity) => (distance_3d(entity.position,bot.entity.position)<30 && entity.kind=='Projectiles');
		const entity = bot.nearestEntity(nearFilter)
		if(entity!=null && entity.id!=runFrom){
			if(Math.abs(entity.velocity.x)+Math.abs(entity.velocity.y)+Math.abs(entity.velocity.z)>0.3){
				runFrom=entity.id;
				bot.setControlState("sprint",true);
				bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(entity, 7)));
				bot.viewer.drawLine('run', [bot.entity.position,entity.position],0xFF0000); 	
			}else{
				if(distance_3d(entity.position,bot.entity.position)<2){
					runFrom=entity.id;
					bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(entity, 3)));
					bot.viewer.drawLine('run', [bot.entity.position,entity.position],0xFF0000); 				
				}
			}
		}
		
		
		const hostileFilter = (entity) => (entity.kind == 'Hostile mobs' || entity.type=='player') && entity.username!='gavain788'  && entity.name!='wither' &&  entity.name!='zombie_pigman'
		const hostileEntity = bot.nearestEntity(hostileFilter)
		
		if(hostileEntity!=null &&  distance_3d(bot.entity.position,hostileEntity.position)<=2){
			//console.log('FIGHTING '+hostileEntity.type);
			bot.setControlState('sprint',true);
			bot.attack(hostileEntity);
		}
		

		if( checkInterval==null && hostileEntity!=null && distance_3d(bot.entity.position,hostileEntity.position)<30 && runFrom!=hostileEntity.id && Math.abs(bot.entity.position.y-hostileEntity.position.y)<12){
			runFrom = hostileEntity.id;
			if(runTimeout!=null){
				clearTimeout(runTimeout);
				runTimeout=null;
			}
			runTimeout = setTimeout(function(){
				runFrom=-5;
				runTimeout=null;
			},500);
			if(hostileEntity.name==null){
				var name = hostileEntity.username;
			}else{
				var name = hostileEntity.name;
			}


			
			//sendDiscordMsg(discordMsg.channel, "Bot", 'Running from '+name+' it is '+distance_3d(bot.entity.position,hostileEntity.position)+' blocks away!');
			offSetVec = bot.entity.position.clone();
			offSetVec = offSetVec.subtract(hostileEntity.position);
			offSetVec = offSetVec.normalize();
			
			if(hostileEntity.username==null || distance_3d(bot.entity.position,hostileEntity.position)>17 ){
				bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(hostileEntity, 10+Math.random()*30)));
				bot.viewer.drawLine('run', [bot.entity.position,hostileEntity.position],0xFF0000); 
				console.log('Running from '+name+' it is '+distance_3d(bot.entity.position,hostileEntity.position).toFixed(2)+' blocks away!');
			
			}else{
				console.log('Player '+name+' is too close he is  '+distance_3d(bot.entity.position,hostileEntity.position).toFixed(2)+' blocks away!');
				bot.pathfinder.setGoal(new GoalFollow(hostileEntity), false);
			}
			 
			 if(bot.food>10){
			bot.setControlState('sprint',true);
			 }
			alert='high';
			pathed=2;
			if(netherPortal!=null){
				if(netherTimeout!=null){
					clearTimeout(netherTimeout);
				}
				toPortal=false;
				netherPortal=null;
			}
		}else if( pathed==0 /*|| Math.round(Math.random()*60)==1)*/ && bot.targetDigBlock==null && toPortal==false ){
			bot.viewer.erase('run'); 
			pathed=1;
			alert='none';
			if(randDir==false){
				gotoX=1000000;
				gotoZ=1000000;
				if(bot.entity.position.x<0){
					gotoX*=-1;
				}
				if(bot.entity.position.z<0){
					gotoZ*=-1;
				}
				
				if(Math.abs(bot.entity.position.x-bot.entity.position.z)>200){
					if(Math.abs(bot.entity.position.x)>Math.abs(bot.entity.position.z)){
						gotoZ=bot.entity.position.z;
					}else{
						gotoX=bot.entity.position.x;
					}
				}
				bot.pathfinder.setGoal(new GoalXZ(gotoX,gotoZ))
			}


		}
		

		
					
		var netherPortals = bot.findBlocks({
			matching : function(block){
				if(block.name.search('portal')!=-1){
					return true;
				}
			},
			
			maxDistance : 150,
			useExtraInfo : true,
			count : 120,
			
		});
		
		netherPortal = null;
		
		
		var lowest = 500;
		for(var k =0; k<netherPortals.length;k++){
			if(netherPortals[k].y<lowest){
			
			var doPortal=1;
			for(var x=0; x<portals.length; x++){
				var portalCheck = portals[x];
				if(distance_3d(portalCheck,netherPortals[k])<10){
					doPortal = 0;
					x=9999;
				}
				}
				
				if(doPortal==1){
				lowest=netherPortals[k].y;
				netherPortal=netherPortals[k];
				}
			}
		}
		if(netherPortal!=null){
		netherPortal.y-=1;
		netherPortal = bot.blockAt(netherPortal);
		netherPortal.position.y+=1;
		}

		

		
		if(netherPortal!=null){
			if(netherPortal.biome.name!='Hell'){
			if(toPortal==false){
			console.log('GOING TO PORTAL!');
			gotoX = netherPortal.position.x;
			gotoZ = netherPortal.position.z; 
			bot.viewer.drawLine('portal', [netherPortal.position,bot.entity.position],0x8F65DC);			
			bot.pathfinder.setGoal(new GoalBlock(netherPortal.position.x,netherPortal.position.y+1,netherPortal.position.z))
			if(netherTimeout!=null){
				clearTimeout(netherTimeout);
			}
			
			netherTimeout = setTimeout(function(){
				if(netherPortal!=null){
				

			
				if(inPortal==false){
					console.log('Could not make it to portal!!');
					console.log('Portal tried and added to list of tried portals');
					portals.push(netherPortal.position.clone())
					toPortal=false;
					pathed=0;
				}else{
					console.log('Waiting for portal.... (may take awhile with TPS)');
				}
			
				}else{
					toPortal=false;
				}
			},90000);
			
			

			pathed=1;
			toPortal=true;
			//}
			}
		}else{
			console.log('MADE IT TO NETHER!');
			runIntoNether();
		}
		}
		
		

	}

}