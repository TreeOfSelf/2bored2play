/*
 ____  ____  __  __  ___  ____  ____  __  __  __  __     ___  __  __  __    __    ____  _  _  ___ 
( ___)(  _ \(  )(  )/ __)(_  _)(  _ \(  )(  )(  \/  )   / __)(  )(  )(  )  (  )  (_  _)( \( )/ __)
 )__)  )   / )(__)( \__ \  )(   )   / )(__)(  )    (   ( (__  )(__)(  )(__  )(__  _)(_  )  (( (_-.
(__)  (_)\_)(______)(___/ (__) (_)\_)(______)(_/\/\_)   \___)(______)(____)(____)(____)(_)\_)\___/

Code for how the frustrum shape is created 


*/

function create_frustrum(){
	
	//Direction vector
	var viewD =  glMatrix.vec3.fromValues(Math.sin(camRotate[0])*Math.cos(camRotate[1]),+Math.cos(camRotate[0])*-Math.cos(camRotate[1]),Math.sin(camRotate[1]));
	//Cam vector
	var camv = glMatrix.vec3.fromValues(cam[0],cam[1],cam[2]);
	//Bring the camera back a bit from your viewing
	glMatrix.vec3.subtract(camv,camv,viewD);
	//Normalize the Directional Vector
	glMatrix.vec3.normalize(viewD,viewD);

	//Right vector
	var right = glMatrix.vec3.create();
	glMatrix.vec3.cross(right,viewD,up);
	glMatrix.vec3.normalize(right,right);

	var reverse = glMatrix.vec3.fromValues( -(Math.sin(camRotate[0])*Math.cos(camRotate[1])) , -(Math.cos(camRotate[0])*-Math.cos(camRotate[1])) ,-Math.sin(camRotate[1]));
	glMatrix.vec3.normalize(reverse,reverse);
	glMatrix.vec3.cross(up,reverse,up);
	glMatrix.vec3.cross(up,up,reverse);
	glMatrix.vec3.normalize(up,up);


	//View Direction Scaled Far
	var viewDSF = glMatrix.vec3.create();
	//Scaled Near
	var viewDSN = glMatrix.vec3.create();
	
	glMatrix.vec3.scale(viewDSF,viewD,zFar);	
	glMatrix.vec3.scale(viewDSN,viewD,zNear);	
	
	
	var farCorner = glMatrix.vec3.create();
	var nearCorner = glMatrix.vec3.create();
	

	glMatrix.vec3.add(farCorner,camv,viewDSF)
	glMatrix.vec3.add(nearCorner,camv,viewDSN)

	var valOne = glMatrix.vec3.fromValues(farSize[1]/2,farSize[1]/2,farSize[1]/2);
	glMatrix.vec3.multiply(valOne,valOne,up);
	
	var valTwo = glMatrix.vec3.fromValues(farSize[0]/2,farSize[0]/2,farSize[0]/2);	
	glMatrix.vec3.multiply(valTwo,valTwo,right);

	var valThree = glMatrix.vec3.fromValues(nearSize[1]/2,nearSize[1]/2,nearSize[1]/2);
	glMatrix.vec3.multiply(valThree,valThree,up);
	
	var valFour = glMatrix.vec3.fromValues(nearSize[0]/2,nearSize[0]/2,nearSize[0]/2);	
	glMatrix.vec3.multiply(valFour,valFour,right);
	


//FAR CORNERS

	var farTopLeft = glMatrix.vec3.create();	

	glMatrix.vec3.add(farTopLeft,farCorner, valOne);
	glMatrix.vec3.subtract(farTopLeft,farTopLeft,valTwo);
	
	var farTopRight = glMatrix.vec3.create();	

	glMatrix.vec3.add(farTopRight,farCorner, valOne);	
	glMatrix.vec3.add(farTopRight,farTopRight,valTwo);
	
	var farBottomLeft = glMatrix.vec3.create();	

	glMatrix.vec3.subtract(farBottomLeft,farCorner, valOne);	
	glMatrix.vec3.subtract(farBottomLeft,farBottomLeft,valTwo);	
	
	var farBottomRight = glMatrix.vec3.create();	

	glMatrix.vec3.subtract(farBottomRight,farCorner, valOne);	
	glMatrix.vec3.add(farBottomRight,farBottomRight,valTwo);	
	
//NEAR CORNERS
	var nearTopLeft = glMatrix.vec3.create();	

	glMatrix.vec3.add(nearTopLeft,nearCorner, valThree);
	glMatrix.vec3.subtract(nearTopLeft,nearTopLeft,valFour);
	
	var nearTopRight = glMatrix.vec3.create();	

	glMatrix.vec3.add(nearTopRight,nearCorner, valThree);	
	glMatrix.vec3.add(nearTopRight,nearTopRight,valFour);
	
	var nearBottomLeft = glMatrix.vec3.create();	

	glMatrix.vec3.subtract(nearBottomLeft,nearCorner, valThree);	
	glMatrix.vec3.subtract(nearBottomLeft,nearBottomLeft,valFour);	
	
	var nearBottomRight = glMatrix.vec3.create();	

	glMatrix.vec3.subtract(nearBottomRight,nearCorner, valThree);	
	glMatrix.vec3.add(nearBottomRight,nearBottomRight,valFour);	
		
//right

	var  v = glMatrix.vec3.create();
	glMatrix.vec3.subtract(v,farBottomRight,farTopRight);
	var u = glMatrix.vec3.create();
	glMatrix.vec3.subtract(u,nearBottomRight,farTopRight);
	 rightN = glMatrix.vec3.create();
	glMatrix.vec3.cross(rightN,v,u);
	glMatrix.vec3.normalize(rightN,rightN);
	 rightD =-glMatrix.vec3.dot(farTopRight,rightN);
	 
//left

	var  v = glMatrix.vec3.create();
	glMatrix.vec3.subtract(v,farBottomLeft,farTopLeft);
	var u = glMatrix.vec3.create();
	glMatrix.vec3.subtract(u,nearBottomLeft,farTopLeft);
	 leftN = glMatrix.vec3.create();
	glMatrix.vec3.cross(leftN,v,u);
	glMatrix.vec3.normalize(leftN,leftN);
	 leftD =-glMatrix.vec3.dot(farTopLeft,leftN);

//Front
	var  v = glMatrix.vec3.create();
	glMatrix.vec3.subtract(v,nearTopLeft,nearTopRight);
	var u = glMatrix.vec3.create();
	glMatrix.vec3.subtract(u,nearBottomRight,nearTopRight);
	 nearN = glMatrix.vec3.create();
	glMatrix.vec3.cross(nearN,v,u);
	glMatrix.vec3.normalize(nearN,nearN);
	 nearD = glMatrix.vec3.dot(nearTopRight,nearN);					
			
//Top
	var  v = glMatrix.vec3.create();
	glMatrix.vec3.subtract(v,farTopLeft,farTopRight);
	var u = glMatrix.vec3.create();
	glMatrix.vec3.subtract(u,nearTopRight,farTopRight);
	 topN = glMatrix.vec3.create();
	glMatrix.vec3.cross(topN,v,u);
	glMatrix.vec3.normalize(topN,topN);
	 topD = glMatrix.vec3.dot(farTopRight,topN);					

//Bottom
	var  v = glMatrix.vec3.create();
	glMatrix.vec3.subtract(v,farBottomLeft,farBottomRight);
	var u = glMatrix.vec3.create();
	glMatrix.vec3.subtract(u,nearBottomRight,farBottomRight);
	bottomN = glMatrix.vec3.create();
	glMatrix.vec3.cross(bottomN,v,u);
	glMatrix.vec3.normalize(bottomN,bottomN);
	bottomD = -glMatrix.vec3.dot(farBottomRight,bottomN);					
			
						
}