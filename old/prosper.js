prosper = function(){
		canScaffold=false;
		console.log('Time to prosper !');
		clear_events();
		goal = ['grass','dirt'];
		goalInv = 'dirt'
		biomeAvoid = ['Desert']
		goalAmount = 32;
		curGoal = 0;
		goalSafe=false;
		goalType='grab'
		biome = '';
		
		
		
		
		get_craftingTable = function(){
		
			var craftingTable = bot.findBlock({
					point : bot.entity.position,
					matching : function(block){
						if(block.name=='crafting_table'){
							return(true);
						}
						},
					maxDistance : 200,
					count: 1,
			
			});
			
			return(craftingTable);
		}
		
		check_goal=function(){
			
			
			var center = {
				x : 0,
				z : 0,
			}
			
			if(distance_2d(center,bot.entity.position)<3000){
				escapeSpawn();
			}
			
			if(goalType =='grab' && check_inventory(goalInv)>=goalAmount){
				curGoal++;
			}
			if(goalType =='craft' && check_inventory(goalInv)>=goalAmount){
				curGoal++;
			}
			/*if(goalType=='place'){
				var checkPlaced = bot.findBlocks({
						point : bot.entity.position,
						matching : function(block){return true;},
						maxDistance : 5,
						count: 20,
				});
				
				for(var k=0; k<checkPlaced.length;k++){
					var block = bot.blockAt(checkPlaced);
					if(block.name.search(goalInv)!=-1){
						k=99999;
						curGoal++;
					}
				}
			}*/
		}
		

		
		goal_reached=function(){
			
		
			
			console.log('DOING GOAL: '+curGoal);
			
			var blockUnder = bot.blockAt(bot.entity.position.offset(0,-0.2,0));
			if(blockUnder!=null && blockUnder.boundingBox=='block'){
				console.log('biome: '+blockUnder.biome.name);
				biome= blockUnder.biome.name;
			}

			if(check_inventory('dirt')<10){
				curGoal=0;
				canScaffold=false;
			}
			

			switch(curGoal){
				default:
					curGoal=0;
				break;
				case 0:
					goal = ['grass','dirt'];
					goalInv = 'dirt'
					goalAmount = 32;	
					goalSafe=false;		
					goalType='grab'					
				break;
				case 1:
					canScaffold=1;
					goal= ['log']
					goalInv = 'log';
					goalAmount = 10;
					goalSafe=true;
					goalType='grab'
				break;
				case 2:
					
					goalType='craft'
					goalAmount=6;
					goal=['plank']
					goalInv='plank'
					if(check_inventory(goalInv)<goalAmount){
					var rcp = bot.recipesFor(5,null,null,null);
					if(rcp.length>0){
					bot.craft(rcp[0],2,null,function(e){
						console.log(e);
						console.log('GOT EM');
					});	
					}
					}
				break;
				case 3:
				if(get_craftingTable()==null){
				goalType='craft'
				goalAmount=1;
				goal=['crafting']
				goalInv='crafting'
				rcp = bot.recipesAll(58,null,null);
				bot.craft(rcp[0],1,null,function(e){
					console.log('cragt 2');
				});
				}
				break;
				case 4:
				console.log(get_craftingTable());
				if(get_craftingTable()==null){
				goalType='place';
				goalAmount=1;
				goal=['crafting']
				goalInv='crafting';
				if(get_inventory('crafting')!=null){
					console.log(get_inventory('crafting'))
					bot.equip(get_inventory('crafting'),"hand",function(e){
						console.log(e);
						bot.updateHeldItem()
						console.log('in hand');
						if(bot.heldItem.name.search('crafting')==-1){
							return;
						}
						var spaces = bot.findBlocks({
								point : bot.entity.position,
								matching : function(block){return true;},
								maxDistance : 2,
								count: 20,
						
						});
						for(var k=0;k<spaces.length;k++){
							var spaceAbove = spaces[k].clone();
							spaceAbove.y+=1;
							var blockAbove = bot.blockAt(spaceAbove);
							var placed=0;
							if(blockAbove.name=='air' && distance_3d(spaces[k],bot.entity.position)>2.0){
								var block = bot.blockAt(spaces[k])
								if(block.boundingBox=='block'){
									console.log(block,spaces[k]);
									placed=1;
									cosnole.log('THISS ONEE');
									bot.pathfinder.setGoal(new GoalBlock(bot.entity.position.x,bot.entity.position.y,bot.entity.position.z));
									bot.placeBlock(block,new Vec3(0,1,0),function(e){
										if(e){
											console.log(e);
										}
									});
									k=99999;
								}
							}

							
						}
						
						if(placed==0){
						console.log('Must move to a more open area to place this!');

						move_random();
						}
					//});
					});
					}
				}
				break;
				case 5:
				goalType='craft'
				goalAmount=2;
				goal=['stick']
				goalInv='stick'
				rcp = bot.recipesAll(280,null,null);
				console.log(rcp);
				bot.craft(rcp[0],1,null,function(e){
					console.log(e);
					console.log('GOTCHA A STICKYY',check_inventory('stick'));
				});			
				break;
				
				case 6:
				goalType='craft'
				goalAmount=1;
				goal=['pickaxe']
				goalInv='pickaxe'
				var craftingTable = get_craftingTable();
				if(craftingTable!=null && distance_3d(craftingTable.position,bot.entity.position)<2){
					console.log('craftinnn');
					rcp = bot.recipesFor(270,null,null,craftingTable);
					
					bot.pathfinder.setGoal(new GoalBlock(bot.entity.position.x,bot.entity.position.y,bot.entity.position.z));
					bot.craft(rcp[0],1,craftingTable,function(e){
						if(!e){
							console.log('crafted pickaxe');
						}else{
							console.log(e);
						}
					});		
				}else{
					if(craftingTable==null){
						curGoal=0;
					}else{
						console.log('Moving to table!');
						bot.pathfinder.setGoal(new GoalNear(craftingTable.position.x,craftingTable.position.y,craftingTable.position.z,1));
						pathed=1;
					}
				}
				break;
				case 7:
					goal = ['stone'];
					goalInv = 'cobblestone'
					goalAmount = 32;	
					goalSafe=false;		
					goalType='grab'					
				break;
			}
					check_goal();
		}
		

		
		
		var tick=0;
		if(aiLogic !=  null){
			clearInterval(aiLogic);
		}
		aiLogic = setInterval(function(){
			if(Math.round(Math.random()*10)==1){
			goal_reached();
			}
			if(bot.food<18 && pathed<2){
				var foodItem = detect_food();
				if(foodItem!=null){
					bot.equip(get_inventory(foodItem),"hand",function(e){
						bot.updateHeldItem()
						console.log(bot.heldItem);
						bot.consume(function(e){
							console.log('restored food to '+bot.food);
						});
					});
				}
			}

			if( bot.targetDigBlock==null){
			
			tick+=1;
			if( Math.abs(Math.round(lastPos[0]) - Math.round(bot.entity.position.x)) <4 &&  Math.abs(Math.round(lastPos[1]) - Math.round(bot.entity.position.y))<4 && Math.abs(Math.round(lastPos[2]) - Math.round(bot.entity.position.z))<4){
				if(tick>=3 && bot.pathfinder.isThinking()==false && inPortal==false){
					stagnant+=1;
					tick=0;
					if(stagnant>=6){
						if(toPortal==false){
							pathed=0;
						}else{
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
						
							
							if(block.y<=bot.entity.position.y+1 

							&& (distance_2d(block,testPos)+0.7<distance_2d(bot.entity.position,testPos))
							&& distance_2d(block,bot.entity.position)>=1.2 && blockAbove.name=='air'){
								var dist = distance_2d(block,bot.entity.position);
								if(dist<curDist){
									var parkourJump = block;
									curDist=dist;
								}
							}
						}
						

						if(parkourJump!=null && parkourAttempts<=6){
							parkourAttempts+=1;
							console.log('attempting parkour jump');
							
							bot.viewer.drawLine('jump', [parkourJump,bot.entity.position],0x00FFD8); 
							
							parkourJump.x+=1;
							console.log(parkourJump);
						
							bot.pathfinder.setGoal(new GoalBlock(parkourJump.x,parkourJump.y,parkourJump.z));
							bot.lookAt(parkourJump,false,function(){
								if(bot.food>10){
								bot.setControlState("sprint",true);
								}
								bot.setControlState("jump",true);
								bot.setControlState("forward",true);
								
								if(distance_2d(parkourJump,bot.entity.position)<2){
								bot.physics.sprintSpeed=3.2;
								}else{
								bot.physics.sprintSpeed=1.85;
								}
								
								console.log(bot.physics.sprintSpeed);
								
								checkInterval = setInterval(function(){
									if(distance_2d(parkourJump,bot.entity.position)<=0.3){
									console.log('ATTEMPTING TO STOP');
									bot.entity.velocity.x=0;
									bot.entity.velocity.y=0;
									bot.entity.velocity.z=0;
									bot.clearControlStates()
									pathed=0;
									bot.physics.sprintSpeed=1.3;
									bot.pathfinder.setGoal(new GoalXZ(bot.entity.position.x,bot.entity.position.z));										
									clearInterval(checkInterval);
									}
								},16);
								
								setTimeout(function(){
									clearInterval(checkInterval);
									pathed=0;
									bot.physics.sprintSpeed=1.3;
									console.log('MAYBBB?')
									bot.pathfinder.setGoal(new GoalXZ(bot.entity.position.x,bot.entity.position.z));	
								},500);
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
					if(stagnant>=40){
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
			

			
			
			
			const hostileFilter = (entity) => (entity.kind == 'Hostile mobs' || entity.type=='player') && entity.username!='gavain788' /*&& entity.name!='wither'*/ && entity.name!='zombie_pigman'
			const hostileEntity = bot.nearestEntity(hostileFilter)
			
			if(hostileEntity!=null &&  distance_3d(bot.entity.position,hostileEntity.position)<=10){
				console.log('FIGHTING '+hostileEntity.type);
				bot.setControlState('jump',true);
				bot.setControlState('sprint',true);
				bot.attack(hostileEntity);
			}
			
			if(  hostileEntity!=null && distance_3d(bot.entity.position,hostileEntity.position)<10 && runFrom!=hostileEntity.id && Math.abs(bot.entity.position.y-hostileEntity.position.y)<6){
				//console.log(hostileEntity);
				runFrom = hostileEntity.id;
				if(hostileEntity.name==null){
					var name = hostileEntity.username;
				}else{
					var name = hostileEntity.name;
				}
				console.log('Running from '+name+' it is '+distance_3d(bot.entity.position,hostileEntity.position)+' blocks away!');
				
				bot.viewer.drawLine('run', [bot.entity.position,hostileEntity.position],0xFF0000); 
		
				
				//sendDiscordMsg(discordMsg.channel, "Bot", 'Running from '+name+' it is '+distance_3d(bot.entity.position,hostileEntity.position)+' blocks away!');
				offSetVec = bot.entity.position.clone();
				offSetVec = offSetVec.subtract(hostileEntity.position);
				offSetVec = offSetVec.normalize();
				
				if(hostileEntity.username==null || distance_3d(bot.entity.position,hostileEntity.position)>10 ){
					console.log('YEERTTT?');
					bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(hostileEntity, 10+Math.random()*30)));
				}else{
					console.log('skerrtt?');
					
					bot.pathfinder.setGoal(new GoalFollow(hostileEntity));
				}
				 
				 if(bot.food>10 && hostileEntity.name!='wither'){
				bot.setControlState('sprint',true);
				 }
				alert='high';
				pathed=2;
			}else if( pathed<2){
				alert='none';

				const passiveFilter = (entity) => (entity.kind == 'Passive mobs')
				const passiveEntity = bot.nearestEntity(passiveFilter)
				if(passiveEntity!=null && bot.food<18){
					if(bot.targetDigBlock==null){
					hunting=true;
					if(distance_3d(passiveEntity.position,bot.entity.position)>3){
						console.log('Going after '+passiveEntity.name+' at distance: '+distance_3d(bot.entity.position,passiveEntity.position));
						bot.pathfinder.setGoal(new GoalNear(passiveEntity.position.x,passiveEntity.position.y,passiveEntity.position.z,2));	
						pathed=1;
					}else{
						console.log('getting food from '+passiveEntity.type);
						bot.attack(passiveEntity);					
					}
					}
				}else{
					hunting=false;
				}
				


			}
			
			
			var goalBlock = bot.findBlock({
				matching : function(block){
					for(var k=0; k<goal.length;k++){
						if(goal[k].search(block.name)!='-1'){
							return true;
						}
					}
				},
				
				maxDistance : 200,
				
			});
			
			if(goalBlock!=null){
				//console.log(goalBlock.position);
			}
			
			var lavaBlock = bot.findBlock({
				matching : function(block){
					if(block.name=='lava'){
						return(true);
					}
				},
				
				maxDistance : 7,
				
			});
				


			if(pathed<2 && bot.targetDigBlock==null && bot.entity.isInWater==false && digging==false ){
				
				const dropFilter = (entity) => (entity.kind == 'Drops')
				const dropEntity = bot.nearestEntity(dropFilter)
				
				if(dropEntity!=null){
					console.log('MEEP');
					bot.pathfinder.setGoal(new GoalBlock(dropEntity.position.x,dropEntity.position.y,dropEntity.position.z));	
				}else if(lavaBlock==null && hunting==false){
					if(goalBlock!=null){
						if(check_inventory(goalInv)<goalAmount){
							var coordsUnder = goalBlock.position.clone();
							coordsUnder.y-=1; 
							var blockUnder = bot.blockAt(coordsUnder)
							console.log(distance_3d(goalBlock.position,bot.entity.position));
							if(distance_3d(goalBlock.position,bot.entity.position)<3){
								
								if(bot.canDigBlock(goalBlock)==true && (blockUnder.boundingBox=='block' || goalSafe==1) ){
									pathed=1;
									bot.viewer.drawLine('dirt', [goalBlock.position,bot.entity.position],0x955114);
									console.log('Grabbing '+goal[0]+' '+check_inventory(goalInv)+'/'+goalAmount);
									
									const tool = bot.pathfinder.bestHarvestTool(goalBlock)
									bot.equip(tool, 'hand', function () {
										
									bot.dig(goalBlock,true,function(e){
										console.log(e);
										pathed=0;
									});
									});
									
									digging = true;
									setTimeout(function(){
										digging=false;
									},2500);

								}
							}else{
								console.log('pathing');
								bot.pathfinder.setGoal(new GoalNear(goalBlock.position.x,goalBlock.position.y,goalBlock.position.z,2));	
								pathed=1;
							}
						}else{
							console.log('Reached '+goalAmount+' '+goal[0]);
						}
					}else{
						if(pathed!=1 && goalType=='grab'){
							console.log('I dont see my goal '+goal[0]+ ', I am going to search around');
							gotoX=Math.random()*50000 - Math.random()*50000;
							gotoZ=Math.random()*50000 - Math.random()*50000;
							bot.pathfinder.setGoal(new GoalXZ(gotoX,gotoZ))
							pathed=1
						}
					}
				}

			}

		
			
		},500);
	  
	

	  bot.on('spawn', () => {
		  
		  if(distance_2d({x:0,z:0},bot.entity.position)<4000){
			  escapeSpawn();
		  }
		  
		 if(killTimeout!=null){
			 clearTimeout(killTimeout);
		 }
		 pathed=0;
		 console.log('Spawned at: ',bot.entity.position.x,bot.entity.position.y,bot.entity.position.z);
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
		digging=false
		console.log('DEES ONE?');
		bot.pathfinder.setGoal(new GoalXZ(bot.entity.position.x,bot.entity.position.z));
	  });
	  
	    bot.on('physicTick',() =>{
			if(bot.entity.isInWater==true){
				bot.setControlState("jump",true);
			}
		})
		
		
	  bot.on('move', () => {

		  
		  
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
		
		  

		if(bot.entity.isInWater==true){
			var blockAbove = bot.entity.position.clone();
			blockAbove.y+=1;
			var blockIn = bot.entity.position.clone();
			blockIn.y-=1;
			var blockCheck = bot.blockAt(blockAbove)
			var blockCheckTwo = bot.blockAt(blockIn)
			if(blockCheck.name!='water'){
				bot.setControlState("jump",true);
				if(bot.entity.position.y<blockCheckTwo.position.y+1.0){
				if(Math.abs(bot.entity.position.y-blockCheckTwo.position.y)<0.25){
				bot.entity.position.y=blockCheckTwo.position.y+1.0+Math.random()*0.3;
				}else{
					
					
					
				xOff=1.5;
				zOff=1.5;
				if(bot.entity.position.x<0){
					xOff*=-1;
				}
				if(bot.entity.position.z<0){
					zOff*=-1;
				}
					
				bot.entity.position.y+=Math.random()*1.5;
				bot.entity.position.x+=Math.random()*xOff;
				bot.entity.position.z+=Math.random()*zOff;
				}
				}
				bot.setControlState('forward',true);
				if(bot.food>10){
					bot.setControlState('sprint',true);
				}
			}else{
				bot.setControlState("jump",true);
			}
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
			console.log('DISSS GUYY');
			bot.pathfinder.setMovements(defaultMove)
			bot.pathfinder.setGoal(new GoalXZ(bot.entity.position.x+offSetVec.z*(100+Math.random()*50),bot.entity.position.z+-offSetVec.x*(10+Math.random()*30)));
			},250);
		}

	  })
	  
	  bot.on('entityHurt', (entity,dmg) => {
		//console.log(entity);
	  });
	  	
}
