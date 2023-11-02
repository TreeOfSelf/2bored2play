var entities = [];
var entityVAO = gl.createVertexArray();
var entityLength=0;
gl.bindVertexArray(entityVAO);
entityBufferPosition = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,entityBufferPosition);
gl.vertexAttribPointer(programInfoPixel.attribLocations.voxelPosition,3,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(programInfoPixel.attribLocations.voxelPosition);	

entityBufferCoords = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,entityBufferCoords);
gl.vertexAttribPointer(programInfoPixel.attribLocations.voxelCoords,1,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(programInfoPixel.attribLocations.voxelCoords);	


entity_createHuman = function(){
	eid = entities.length;
	entities[eid] = {
		lookDir : [0,0],
		lookDirGoto : [0,0,0],
		anim : 'idle',
		position : [0,0,0],
		positionGoto : [0,0,0],
		speed : 1,
		parts : [

			[0,0,-2.7,0], //Head 0
			[0,0,-1.4,3], //Chest 1
			[0.5,0,0,4], //Foot 2
			[-0.5,0,0,4], //Foot 3
			[1.1,0,-1.7,5], //Hand 4
			[-1.1,0,-1.7,5], //Hand 5
			[0.3,0.6,-2.7,1], //Eye 6
			[-0.3,0.6,-2.7,1], //Eye 7
		],
		
		partsOffset : [
			[0,0,0], //Head
			[0,0,0], //Chest
			[0,0,0], //Foot
			[0,0,0], //Foot
			[0,0,0], //Hand
			[0,0,0], //Hand	
			[0,0,0], //Eye
			[0,0,0], //Eye	
		],
		
		partsAnim : [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			
		],
		alive : 1,
	}
	return(eid);
}

players.push([0,entity_createHuman()]);


entity_anim=function(entityID,anim){
	if(entities[entityID].anim==anim){
		return;
	}
	entities[entityID].anim=anim;
	for(var k=0;k<entities[entityID].partsAnim.length;k++){
		entities[entityID].partsAnim[k]=0;
	}
}

entity_setAnim=function(entityID){
	switch(entities[entityID].anim){
		case "jump":
			//Loop through parts of entity
			for(var g=0;g<entities[entityID].parts.length;g++){	
				switch(g){
					//head
					case 0:
						switch(entities[entityID].partsAnim[g]){
							//Head up
							case 0:
								var offset=[0,0,-0.4]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.09*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.09*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.09*deltaTime
							break;
						}
					break;
					//chest
					case 1:
						switch(entities[entityID].partsAnim[g]){
							//Chest up
							case 0:
								var offset=[0,0,-0.3]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.09*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.09*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.09*deltaTime

							break;
						}
					break;
					//foot
					case 2:
						switch(entities[entityID].partsAnim[g]){
							//foot out
							case 0:
								var offset=[0.5,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.09*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.09*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.09*deltaTime

							break;
						}
					break;
					//foot
					case 3:
						switch(entities[entityID].partsAnim[g]){
							//foot out
							case 0:
								var offset=[-0.5,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.09*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.09*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.09*deltaTime

							break;
						}					
					break;
					//hand
					case 4:
						switch(entities[entityID].partsAnim[g]){
							//Hand out
							case 0:
								var offset=[0.3,0,-2]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.09*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.09*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.09*deltaTime
							break;
						}
					break;
					//hand
					case 5:
						switch(entities[entityID].partsAnim[g]){
							//Hand out
							case 0:
								var offset=[-0.3,0,-2]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.09*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.09*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.09*deltaTime
							break;
						}
					break;
				}
			}
		break;
		case "idle":
			//Loop through parts of entity
			for(var g=0;g<entities[entityID].parts.length;g++){	
				switch(g){
					//head
					case 0:
						switch(entities[entityID].partsAnim[g]){
							//Head down
							case 0:
								var offset=[0,0,0.3]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime

								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=1;
								}
							break;
							case 1:
							//Head up 
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=0;
								}
						}
					break;
					//chest
					case 1:
						switch(entities[entityID].partsAnim[g]){
							//Chest down
							case 0:
								var offset=[0,0,0.35]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.005*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.005*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.005*deltaTime

								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=1;
								}
							break;
							case 1:
							//Chest up 
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.005*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.005*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.005*deltaTime
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=0;
								}
						}
					break;
					//foot
					case 2:
						switch(entities[entityID].partsAnim[g]){
							//Foot normal
							case 0:
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime
							break;
						}
					break;
					//foot
					case 3:
						switch(entities[entityID].partsAnim[g]){
							//Foot normal
							case 0:
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime
							break;
						}
					break;
					//hand
					case 4:
						switch(entities[entityID].partsAnim[g]){
							//Hand down
							case 0:
								var offset=[0,0,0.3]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime

								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=1;
								}
							break;
							case 1:
							//Hand up 
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=0;
								}
						}
					break;
					//hand
					case 5:
						switch(entities[entityID].partsAnim[g]){
							//Hand down
							case 0:
								var offset=[0,0,0.3]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime

								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=1;
								}
							break;
							case 1:
							//Hand up 
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=0;
								}
						}
					break;
				}
			}
		break;
		case "walk":
			//Loop through parts of entity
			for(var g=0;g<entities[entityID].parts.length;g++){	
				switch(g){
					//head
					case 0:
						switch(entities[entityID].partsAnim[g]){
							//Head down
							case 0:
								var offset=[0,0,0.3]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.005*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.005*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.005*deltaTime*entities[entityID].speed

								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=1;
								}
							break;
							case 1:
							//Head up 
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.005*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.005*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.005*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=0;
								}
						}
					break;
					//chest
					case 1:
						switch(entities[entityID].partsAnim[g]){
							//Chest down
							case 0:
								var offset=[0,0,0.35]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.005*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.005*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.005*deltaTime*entities[entityID].speed

								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=1;
								}
							break;
							case 1:
							//Chest up 
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.005*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.005*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.005*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=0;
								}
						}
					break;
					//foot
					case 2:
						switch(entities[entityID].partsAnim[g]){
							case 0:
								var offset=[0,0,-0.7]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
									
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=6;
									entities[entityID].partsAnim[g+1]=6;
								}
							break;
							case 1:
								var offset=[0,0.5,-0.7]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=0;
									entities[entityID].partsAnim[g+1]=0;
								}
							break;
							case 2:
								var offset=[0,0.5,0.0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=1;
									entities[entityID].partsAnim[g+1]=1;
								}
							break;
							case 3:
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=2;
									entities[entityID].partsAnim[g+1]=2;
								}
							break;
							case 4:
								var offset=[0,-0.5,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=3;
									entities[entityID].partsAnim[g+1]=3;
								}
							break;
							case 5:
								var offset=[0,-0.5,-0.7]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=4;
									entities[entityID].partsAnim[g+1]=4;
								}
							break;
							case 6:
								var offset=[0,-0.0,-0.7]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=5;
									entities[entityID].partsAnim[g+1]=5;
								}
							break;
						}
					break;
					//foot
					case 3:
						switch(entities[entityID].partsAnim[g]){
							//Foot normal
							case 0:
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
							break;
							case 1:
								var offset=[0,-0.5,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
							break;
							case 2:
								var offset=[0,-0.5,-0.7]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
							break;
							case 3:
								var offset=[0,-0.0,-0.7]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
							break;
							case 4:
								var offset=[0,0.5,-0.7]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
							break;
							case 5:
								var offset=[0,0.5,0.0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
							break;
							case 6:
								var offset=[0,0.0,0.0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.03*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.03*deltaTime*entities[entityID].speed
							break;
						}
					break;
					//hand
					case 4:
						switch(entities[entityID].partsAnim[g]){
							//Hand down
							case 0:
								var offset=[0,0,0.3]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime*entities[entityID].speed

								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=1;
								}
							break;
							case 1:
							//Hand up 
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=0;
								}
						}
					break;
					//hand
					case 5:
						switch(entities[entityID].partsAnim[g]){
							//Hand down
							case 0:
								var offset=[0,0,0.3]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime*entities[entityID].speed

								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=1;
								}
							break;
							case 1:
							//Hand up 
								var offset=[0,0,0]
								entities[entityID].partsOffset[g][0]+=(offset[0]-entities[entityID].partsOffset[g][0])*0.006*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][1]+=(offset[1]-entities[entityID].partsOffset[g][1])*0.006*deltaTime*entities[entityID].speed
								entities[entityID].partsOffset[g][2]+=(offset[2]-entities[entityID].partsOffset[g][2])*0.006*deltaTime*entities[entityID].speed
								
								if(Math.abs(entities[entityID].partsOffset[g][0]-offset[0])<0.1 && 
								Math.abs(entities[entityID].partsOffset[g][1]-offset[1])<0.1 &&
								Math.abs(entities[entityID].partsOffset[g][2]-offset[2])<0.1){
									entities[entityID].partsAnim[g]=0;
								}
						}
					break;
				}
			}
		break;
	}
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

entity_ease = function(){
	//Loop through all entities except player
	for(var k=0;k<entities.length;k++){
		if(entities[k].alive==1){
			
			if( Math.abs(entities[k].lookDir[0] -entities[k].lookDirGoto[0])<6.283/2+0.05){
				//straight forward ease not worrying about direction
				entities[k].lookDir[0]+=(entities[k].lookDirGoto[0]-entities[k].lookDir[0])*0.05*deltaTime;
			}else{
				if(entities[k].lookDir[0] < entities[k].lookDirGoto[0]){
					entities[k].lookDir[0]-=(entities[k].lookDir[0]+Math.abs(entities[k].lookDirGoto[0]))*0.05*deltaTime;
					if(entities[k].lookDir[0]<=0){
						entities[k].lookDir[0]=6.283
					}
				}else{
					
					entities[k].lookDir[0]+=(parseInt(entities[k].lookDirGoto[0])+Math.abs(entities[k].lookDir[0])+0.3)*0.05*deltaTime;

					if(entities[k].lookDir[0]>=6.283){
						entities[k].lookDir[0]=0
					}					
				}
			}
				
				
			cam[0]+=(entities[k].positionGoto[0]-entities[k].position[0])*0.05*deltaTime;
			cam[1]+=(entities[k].positionGoto[1]-entities[k].position[1])*0.05*deltaTime;
			cam[2]+=(entities[k].positionGoto[2]-entities[k].position[2])*0.05*deltaTime;

			
			entities[k].lookDir[1]+=(entities[k].lookDirGoto[1]-entities[k].lookDir[1])*0.05*deltaTime;
			entities[k].position[0]+=(entities[k].positionGoto[0]-entities[k].position[0])*0.05*deltaTime;
			entities[k].position[1]+=(entities[k].positionGoto[1]-entities[k].position[1])*0.05*deltaTime;
			entities[k].position[2]+=(entities[k].positionGoto[2]-entities[k].position[2])*0.05*deltaTime;
			

		}
	}		
}

entity_buildBuffer = function(){
	gl.bindVertexArray(entityVAO);
	//Loop through entities
	var position=[];
	var coords=[];
	entity_ease();
	if(ortho==1){
		var startK=0;
	}else{
		var startK=0;
	}
	for(var k=startK;k<entities.length;k++){
		if(entities[k].alive==1){
			entity_setAnim(k);
			//Loop through parts of entity
			for(var g=0;g<entities[k].parts.length;g++){

				if(entities[k].parts[g][3]!=0 && entities[k].parts[g][3]!=2){

				if(entities[k].parts[g][3]==1 || entities[k].parts[g][3]==2){ //0.3,0.8,-2.7
					var vector = glMatrix.vec3.fromValues(entities[k].parts[g][0]+entities[k].partsOffset[0][0],entities[k].parts[g][1]+entities[k].partsOffset[0][1],entities[k].parts[g][2]+entities[k].partsOffset[0][2]);
					var workDir=entities[k].lookDir[1];
					if(workDir>1.0){
						workDir=1.0;
					}
					if(workDir<-1.0){
						workDir=-1.0;
					}
					glMatrix.vec3.rotateX(vector,vector,[vector[0]-0.3,vector[1]-0.8,vector[2]+0.27],workDir);
				}else{
					var vector = glMatrix.vec3.fromValues(entities[k].parts[g][0]+entities[k].partsOffset[g][0],entities[k].parts[g][1]+entities[k].partsOffset[g][1],entities[k].parts[g][2]+entities[k].partsOffset[g][2]);
				}					

				glMatrix.vec3.rotateZ(vector,vector,[0,0,0],entities[k].lookDir[0]+6.283/2);
				vector[0]/=2;
				vector[1]/=2;
				vector[2]/=2;
				position.push(vector[0]+entities[k].position[0],vector[1]+entities[k].position[1],vector[2]+entities[k].position[2]);
				coords.push(entities[k].parts[g][3]);
				}else{

					var vector = glMatrix.vec3.fromValues(entities[k].parts[g][0]+entities[k].partsOffset[g][0],entities[k].parts[g][1]+entities[k].partsOffset[g][1],entities[k].parts[g][2]+entities[k].partsOffset[g][2]);
					glMatrix.vec3.rotateZ(vector,vector,[0,0,0],entities[k].lookDir[0]);
					vector[0]/=2;
					vector[1]/=2;
					vector[2]/=2;
					position.push(vector[0]+entities[k].position[0],vector[1]+entities[k].position[1],vector[2]+entities[k].position[2]);
					coords.push(entities[k].parts[g][3]);	


				}
			}
		}
	}
	entityLength = position.length/3;
	gl.bindBuffer(gl.ARRAY_BUFFER,entityBufferPosition);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(position),gl.DYNAMIC_DRAW);	
	gl.bindBuffer(gl.ARRAY_BUFFER,entityBufferCoords);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(coords),gl.DYNAMIC_DRAW);	
}
entity_buildBuffer();