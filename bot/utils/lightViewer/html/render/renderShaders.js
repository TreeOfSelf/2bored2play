/*
 ____  _  _   __   ____  ____  ____  ____ 
/ ___)/ )( \ / _\ (    \(  __)(  _ \/ ___)
\___ \) __ (/    \ ) D ( ) _)  )   /\___ \
(____/\_)(_/\_/\_/(____/(____)(__\_)(____/

Shaders & uniform/attribute information 

 */

//Definitions

//Get canvas 
canvas = document.querySelector("#pandaCanvas");

//Get gl context and turn of premultiplied alpha
const gl = canvas.getContext("webgl2",{
	alpha: false,
	antialias : false,
});


//Init shader program
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}


//Load shader
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	if(type == gl.FRAGMENT_SHADER){
		var typeInfo = 'FRAGMENT';
	}else{
		 var typeInfo= 'VERTEX';
	}
    alert('An error occurred compiling the shader '+typeInfo+': ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
 



/*
  ___  _  _  ____  ____    ____  _  _   __   ____  ____  ____ 
 / __)/ )( \(  _ \(  __)  / ___)/ )( \ / _\ (    \(  __)(  _ \
( (__ ) \/ ( ) _ ( ) _)   \___ \) __ (/    \ ) D ( ) _)  )   /
 \___)\____/(____/(____)  (____/\_)(_/\_/\_/(____/(____)(__\_)
*/


//Vertex Shader
const vsSourceCube = `#version 300 es

//Block Position
in vec3 aPixelPosition;
//Block Color
in vec3 aPixelColor;



//Camera Position
uniform vec3 uCam;
//Perspective Matrix
uniform mat4 uMatrix;
//Orthographic
uniform int uOrtho;


out lowp vec4 vPixelColor;
out lowp float vColor;
void main() {


	//Get screen position
	gl_Position =  uMatrix *vec4(aPixelPosition[0],-aPixelPosition[2],aPixelPosition[1],1.0);
	

	//Size based on distance for shading
	vColor =(distance(vec3(uCam[0],uCam[1],uCam[2]),vec3(aPixelPosition[0],aPixelPosition[1],aPixelPosition[2]))*0.2);	
	if(vColor>75.0){
		vColor=max(min(vColor*0.008,0.9),0.7);
	}else{
		if(vColor>30.0){
		vColor=max(min(vColor*0.015,0.7),0.5);	
		}else{
		vColor=min(vColor*0.030,0.5);
		}
	}

	//Different depth depending on orthographic/perspective
	if(uOrtho==1){
		gl_Position[2]*=0.5;
	}
	if(uOrtho==2){
		gl_Position[2]*=0.1;
	}

	//Set color 0-1 based on 255 values
	vPixelColor = vec4(aPixelColor[0]/255.0,aPixelColor[1]/255.0,aPixelColor[2]/255.0,1.0);

}
`;

//Fragment Shader
const fsSourceCube = `#version 300 es
in lowp vec4 vPixelColor;
in lowp float vColor;

out lowp vec4 fragColor;

void main() {
	//Mix color with shading
	fragColor = mix(vPixelColor,vec4(0.0,0.0,0.0,1.0),vColor);
}
`;


//Vertex Shader
const vsSourcePixel = `#version 300 es

//Block Position
in vec3 aPixelPosition;
//Block Color
in float aPixelCoords;



//Camera Position
uniform vec3 uCam;
//Perspective Matrix
uniform mat4 uMatrix;
//Orthographic
uniform int uOrtho;
uniform vec2 uScreenSize;
uniform float uZoom;

out lowp float vColor;
out lowp float vCoords;
void main() {

	//Get screen position
	if(uOrtho==0){
	gl_Position =  uMatrix *vec4(aPixelPosition[0],-aPixelPosition[2]-2.6,aPixelPosition[1],1.0);
	}else{
	gl_Position =  uMatrix *vec4(aPixelPosition[0],-aPixelPosition[2]-2.6,aPixelPosition[1],1.0);		
	}


	//Size based on distance for shading
	vColor =(distance(vec3(uCam[0],uCam[1],uCam[2]),vec3(aPixelPosition[0],aPixelPosition[1],aPixelPosition[2]))*0.2);	
	if(vColor>75.0){
		vColor=max(min(vColor*0.008,0.9),0.7);
	}else{
		if(vColor>30.0){
		vColor=max(min(vColor*0.015,0.7),0.5);	
		}else{
		vColor=min(vColor*0.030,0.5);
		}
	}
	

	//Different depth depending on orthographic/perspective
	if(uOrtho==1){
		gl_Position[2]*=0.5;
		gl_PointSize = 20.0/gl_Position[2] * uScreenSize[1]/1800.0 * 25.0/uZoom;
		vCoords = aPixelCoords;
	}else{
		gl_PointSize = 2000.0/gl_Position[2] * uScreenSize[1]/1800.0;	
		vCoords = aPixelCoords;

	
	}
}
`;

//Fragment Shader
const fsSourcePixel = `#version 300 es
in lowp float vColor;
in lowp float vCoords;

uniform lowp sampler2DArray uSampler;

out lowp vec4 fragColor;

void main() {
	//Mix color with shading
	fragColor = texture(uSampler,vec3(gl_PointCoord[0],gl_PointCoord[1],vCoords));
	if(fragColor.a<0.9){
		discard;
	}
}
`;

//Create shader program

const shaderProgramCube = initShaderProgram(gl, vsSourceCube, fsSourceCube);
//Create shader program info
const programInfoCube = {
	program: shaderProgramCube,
	
	attribLocations: {
	//Voxel Position 3v (shorts only)
	  voxelPosition: gl.getAttribLocation(shaderProgramCube, 'aPixelPosition'),
	  //Voxel Color 3v (works on 255 scale)
	  voxelColor : gl.getAttribLocation(shaderProgramCube, 'aPixelColor'),
	},
	
	uniformLocations: {
		//Camera coordiantes 3v
		cam : gl.getUniformLocation(shaderProgramCube, 'uCam'),
		//Projection matrix
		projectionMatrix : gl.getUniformLocation(shaderProgramCube,'uMatrix'),
		//Ortho view
		ortho : gl.getUniformLocation(shaderProgramCube,'uOrtho'),

	},
};

const shaderProgramPixel = initShaderProgram(gl, vsSourcePixel, fsSourcePixel);
//Create shader program info
const programInfoPixel = {
	program: shaderProgramPixel,
	
	attribLocations: {
	//Voxel Position 3v (shorts only)
	  voxelPosition: gl.getAttribLocation(shaderProgramPixel, 'aPixelPosition'),
	  //Voxel Color 3v (works on 255 scale)
	  voxelCoords : gl.getAttribLocation(shaderProgramPixel, 'aPixelCoords'),
	},
	
	uniformLocations: {
		//Camera coordiantes 3v
		cam : gl.getUniformLocation(shaderProgramPixel, 'uCam'),
		//Projection matrix
		projectionMatrix : gl.getUniformLocation(shaderProgramPixel,'uMatrix'),
		//Ortho view
		ortho : gl.getUniformLocation(shaderProgramPixel,'uOrtho'),
		sampler : gl.getUniformLocation(shaderProgramPixel,'uSampler'),
		screenSize : gl.getUniformLocation(shaderProgramPixel,'uScreenSize'),
		zoom : gl.getUniformLocation(shaderProgramPixel,'uZoom'),
	},
};

