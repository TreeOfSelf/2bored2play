
runIntoNether = function () {
	clear_events();
	console.log('Runnzng into nether!');
	
	var tick=0;
		if(aiLogic !=  null){
			clearInterval(aiLogic);
		}
		aiLogic = setInterval(function(){
			
			


			if( bot.targetDigBlock==null){
			
			tick+=1;
			if( Math.abs(Math.round(lastPos[0]) - Math.round(bot.entity.position.x)) <4 &&  Math.abs(Math.round(lastPos[1]) - Math.round(bot.entity.position.y))<4 && Math.abs(Math.round(lastPos[2]) - Math.round(bot.entity.position.z))<4){
				if(tick>=3 && bot.pathfinder.isThinking()==false && inPortal==false){
					stagnant+=1;
					tick=0;
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
									/*if(netherTimeout!=null){
										clearTimeout(netherTimeout);
										netherPortal=null;
										toPortal=false;
									}*/
							}
							}else{
								netherPortal=null;
							}
						}
						
						var checkDist = {
							x : gotoX,
							z : gotoZ,
						}
						
						//Willing to jump down to a close portal 
						if(netherPortal!=null){
						if(toPortal==true && distance_2d(checkDist,bot.entity.position) && netherPortal.y<bot.entity.y){
							var maxDist = 20;
						}else{
							var maxDist = 5;
						}
						}else{
							toPortal==false;
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
							
							if(block.y<=bot.entity.position.y 

							&& (distance_2d(block,testPos)+2.3<distance_2d(bot.entity.position,testPos))
							 && blockAbove.boundingBox!='block'){
								var dist = distance_2d(block,bot.entity.position);
								if(dist<curDist){
									var parkourJump = block.clone();
									curDist=dist;
								}
							}
						}
						

						if(parkourJump!=null && parkourAttempts<=6 && bot.entity.isInWater==false){

							parkourAttempts+=1;
							console.log('attempting parkour jump');
							console.log(bot.entity.position);
							
							
						
							bot.viewer.drawLine('jump', [parkourJump,bot.entity.position],0x00FFD8); 
	
							//parkourJump.z-=1.0;
							//parkourJump.y+=1;
							
							console.log(parkourJump);
							bot.pathfinder.setGoal(new GoalBlock(parkourJump.x,parkourJump.y,parkourJump.z));
							bot.lookAt(parkourJump,false,function(){
								if(bot.food>10){
								bot.setControlState("sprint",true);
								}
								bot.setControlState("jump",true);
								bot.setControlState("forward",true);
			
								
								if(distance_2d_fixed(parkourJump,bot.entity.position)<=2){
								bot.physics.sprintSpeed=1.3;
								}else{
									if(distance_2d_fixed(parkourJump,bot.entity.position)<=4.5){
								bot.physics.sprintSpeed=1.9;
									}else{
									bot.physics.sprintSpeed=1.5;
									}
								}
								
								console.log(bot.physics.sprintSpeed);
								
								parkourJumpRef = parkourJump.clone();
								
								var initDist = distance_2d(parkourJumpRef,bot.entity.position)
								
	
								checkInterval = setInterval(function(){
									var checkDist = distance_2d_fixed(parkourJump,bot.entity.position);
									if(checkDist<=1.5 ){
									bot.entity.velocity.x*=0.95;
									bot.entity.velocity.y*=0.95;
									bot.entity.velocity.z*=0.95;
									bot.clearControlStates()
									
									if(checkDist<=0.2 ){
									console.log('YEERT');
									bot.entity.velocity.x=0;
									bot.entity.velocity.z=0;
									pathed=0;
									bot.physics.sprintSpeed=1.3;
									bot.pathfinder.setGoal(new GoalXZ(bot.entity.position.x,bot.entity.position.z));										
									clearInterval(this);
									}
									
									if(checkDist>initDist+1){
										clearInterval(this);
										bot.physics.sprintSpeed=1.3;
									}
									}
								},16);
								
		
							});			
						}else{
							if(toPortal==true){
								console.log('screw this portal');
								portals.push(netherPortal.position.clone())
								toPortal=false;
								netherPortal=null;
								if(netherTimeout!=null){
									clearTimeout(netherTimeout);
								}
							}

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
								}else{
									console.log('Attempting new direction for awhile, not worth jumping from here');
									gotoX=Math.random()*50000 - Math.random()*50000;
									gotoZ=Math.random()*50000 - Math.random()*50000;
									bot.pathfinder.setGoal(new GoalXZ(gotoX,gotoZ))
									pathed=1
								}
							}

						}		
									
						
					}
					if(stagnant>=60){
						console.log('I think I am stuck, I am killing myself');
						bot.chat('/kill');
					}
				}
			}else{
				parkourAttempts=0;
				waterAttempts=0;
				stagnant=0;
				tick=0;
				lastPos = [bot.entity.position.x,bot.entity.position.y,bot.entity.position.z];
			}

	
			}else{
			tick=0;
			}
			
			
			const hostileFilter = (entity) => (entity.kind == 'Hostile mobs' || entity.type=='player') && entity.username!='gavain788' && entity.name!='wither' && entity.name!='zombie_pigman'
			const hostileEntity = bot.nearestEntity(hostileFilter)
			
			if(hostileEntity!=null &&  distance_3d(bot.entity.position,hostileEntity.position)<=10){
				console.log('FIGHTING '+hostileEntity.type);
				bot.setControlState('jump',true);
				bot.setControlState('sprint',true);
				bot.attack(hostileEntity);
			}
			
	
			
			if(  hostileEntity!=null && distance_3d(bot.entity.position,hostileEntity.position)<30 && runFrom!=hostileEntity.id && Math.abs(bot.entity.position.y-hostileEntity.position.y)<12){
				runFrom = hostileEntity.id;
				if(hostileEntity.name==null){
					var name = hostileEntity.username;
				}else{
					var name = hostileEntity.name;
				}
				console.log('Running from '+name+' it is '+distance_3d(bot.entity.position,hostileEntity.position)+' blocks away!');
				
				bot.viewer.drawLine('run', [bot.entity.position,hostileEntity.position],0xFF0000); 
		
				
				offSetVec = bot.entity.position.clone();
				offSetVec = offSetVec.subtract(hostileEntity.position);
				offSetVec = offSetVec.normalize();
				
				if(hostileEntity.username==null){
					bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(hostileEntity, 10+Math.random()*30)));
				}else{
					bot.pathfinder.setGoal(new GoalFollow(hostileEntity), false);
				}
				 
				 if(bot.food>10 && hostileEntity.name!='wither'){
				bot.setControlState('sprint',true);
				 }
				alert='high';
				pathed=2;
				if(netherPortal!=null){
					if(netherTimeout!=null){
						netherPortal=null;
						toPortal=false;
						clearTimeout(netherTimeout);
					}
				}
			}else if( pathed==0 /*|| Math.round(Math.random()*60)==1)*/ && bot.targetDigBlock==null && toPortal==false){
				console.log('safe, navigating around now');
				
				if(bot.entity.position.y>110){
					bot.viewer.erase('run'); 
					console.log(bot.entity.position.x,bot.entity.position.y,bot.entity.position.z);
					//sendDiscordMsg(discordMsg.channel, "Bot", 'Safe');
					pathed=1;
					alert='none';
					//bot.pathfinder.setGoal(new GoalXZ(-336,268 ))
					gotoX=1000000;
					gotoZ=1000000;
					if(bot.entity.position.x<0){
						gotoX*=-1;
					}
					if(bot.entity.position.z<0){
						gotoZ*=-1;
					}

					bot.pathfinder.setGoal(new GoalXZ(gotoX,gotoZ))
				}else{
					console.log(bot.entity.position.x,bot.entity.position.y,bot.entity.position.z);
					console.log('Too low attempting to get higher ;) ;)');
					bot.pathfinder.setGoal(new GoalY(120))		
					pathed=1;
					alert='none';
					bot.viewer.erase('run'); 
				}

			}
			
			var zeroCoords = {
				x : 0,
				z : 0,
			}
			

			if ((distance_2d(zeroCoords,bot.entity.position)>1500+Math.random()*1000 && Math.round(Math.random()*60)==1) || bot.food<8){	
				console.log('Checking for nearby portals');
							
				var netherPortals = bot.findBlocks({
					matching : function(block){
						if(block.name.search('portal')!=-1){
							return true;
						}
					},
					
					maxDistance : 50,
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
					if(toPortal==false){
					console.log('GOING TO PORTAL!');
					gotoX = netherPortal.position.x;
					gotoZ = netherPortal.position.z; 
					bot.viewer.drawLine('portal', [netherPortal.position,bot.entity.position],0x8F65DC);		
					bot.pathfinder.setGoal(new GoalBlock(netherPortal.position.x,netherPortal.position.y,netherPortal.position.z))
					
					
					netherTimeout = setTimeout(function(){
						if(netherPortal!=null){
						

					
						if(bot.blockAt(bot.entity.position).name!='portal'){
							console.log('Could not make it to portal!!');
							console.log('Portal tried and added to list of tried portals');
							portals.push(netherPortal.position.clone())
							toPortal=false;
							pathed=0;
						}else{
							inPortal=true;
							console.log('Waiting for portal.... (may take awhile with TPS)');
						}
					
						}else{
							toPortal=false;
						}
					},60000);
					
					
					
					pathed=1;
					toPortal=true;
					}
				
				}			
			}

			
			
		},50);
	  


	  bot.on('spawn', () => {
		 console.log('Spawned at: ',bot.entity.position.x,bot.entity.position.y,bot.entity.position.z);

		var checkNether =  bot.findBlocks({
			matching : function(block){
				if(block){
					return true;
				}
			},
			maxDistance: 1,
			count : 30,
		});
		
		var nether = 0;
		
		for(var k =0; k<checkNether.length ; k++){
			checkNether[k] = bot.blockAt(checkNether[k]);
			if(checkNether[k].biome.name!='Hell'){
				console.log('overworld detected ');
				checkOverworld();
				k=999999;
				nether=1;
			}
		}
				 
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
	  

	  bot.on('move', () => {

		var pointOne = bot.entity.position.clone();
		pointOne.x = gotoX;
		pointOne.z = gotoZ;
		var pointTwo = bot.entity.position.clone();
		bot.viewer.drawLine('path', [pointOne,pointTwo],0x40EE28); 
		
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

}
