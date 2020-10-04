/* global THREE */
global.THREE = require('three')
require('three/examples/js/controls/OrbitControls')
require('three/examples/js/controls/PointerLockControls')
const { WorldRenderer } = require('./worldrenderer')
const { Entities } = require('./entities')
const { Primitives } = require('./primitives')
const Vec3 = require('vec3').Vec3

const io = require('socket.io-client')
socket = io()

scene = new THREE.Scene()
scene.background = new THREE.Color('lightblue')

const ambientLight = new THREE.AmbientLight(0xcccccc)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(1, 1, 0.5).normalize()
scene.add(directionalLight)

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.rotation.order = "YXZ";
camera.position.z = 5
let firstPositionUpdate = true
follow = false;
firstPerson = false;
controlled = false;

const world = new WorldRenderer(scene)
const entities = new Entities(scene)
const primitives = new Primitives(scene)

const canvas = document.getElementById("draw");
const renderer = new THREE.WebGLRenderer({canvas : canvas})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

controls = new THREE.PointerLockControls(camera, renderer.domElement)
controlsOrbit = new THREE.OrbitControls(camera, renderer.domElement)


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


canvas.onclick = function(){
	if( (firstPerson == 0 || controlled == 1) && follow == false){
		controls.lock();
	}
	
	/*if(controlled == 1 && firstPerson == true){
		canvas.requestPointerLock();
	}*/
	
}



/*canvas.onmousemove = function(e){
	
	if((document.pointerLockElement === canvas ||
	  document.mozPointerLockElement === canvas) && controlled == true) {
		socket.emit('look',[-e.movementY,-e.movementX]);
	}
}*/

setInterval(function(){
	if(controlled==true){
		socket.emit('lookSet',[camera.rotation.x,camera.rotation.y]);
	}
},16);

keys = [];

document.body.onkeydown = function(e){
	if(controlled==0){
		keys[e.key.toLowerCase()]=1;
	}else{
		socket.emit("keydown",e.key.toLowerCase());
	}
	
	if(keys['r']==1){
		camera.position.set(botMesh.position.x,botMesh.position.y+3,botMesh.position.z);
	}
	
	if(keys['enter']==1){
		document.body.requestFullScreen();
	}
}

document.body.onkeyup = function(e){
	if(controlled==0){
		keys[e.key.toLowerCase()]=0;
	}else{
		socket.emit("keyup",e.key.toLowerCase());
	}
}


function animate () {
	
	if(firstPerson==false){
		var moveSpeed = 0.3;
		if(keys['shift']==1){
			moveSpeed=1;
		}
		
		if(keys['w']==1){
			controls.moveForward(moveSpeed);
		}

		if(keys['s']==1){
			controls.moveForward(-moveSpeed);
		}
		
		if(keys['a']==1){
			controls.moveRight(-moveSpeed);
		}

		if(keys['d']==1){
			controls.moveRight(moveSpeed);
		}
		
		if(keys['q']==1){
			camera.position.y+=moveSpeed;
		}

		if(keys['e']==1){
			camera.position.y-=moveSpeed;
		}
	
	}


	window.requestAnimationFrame(animate)
	if (controlsOrbit.enabled && firstPerson==true) controlsOrbit.update()
	renderer.render(scene, camera)


}
animate()

botMesh = 0;
socket.on('version', (version,fp,fl) => {
	firstPerson=fp;
	follow= fl;
	
	
	if(firstPerson==true || follow==true){
		controls.enabled=false;
		controlsOrbit.enabled=true;
	}else{	
		controls.enabled=true;
		controlsOrbit.enabled=false;		
	}
  console.log('Using version: ' + version)
  world.setVersion(version)
  entities.clear()
  primitives.clear()
  firstPositionUpdate = true
	lastPitch = 0;
	lastYaw = 0;
	teleTo=0;

  socket.on('position', ({ pos, addMesh, yaw, pitch }) => {
		
	  document.getElementById("coords").innerHTML = pos.x.toFixed(2)+' , '+pos.y.toFixed(2)+' , '+pos.z.toFixed(2);
	  if(botMesh!=0){
		  var posVec = new Vec3(pos.x,pos.y,pos.z);
		  
		  if(firstPerson==false){
			var camVec = new Vec3(botMesh.position.x,botMesh.position.y,botMesh.position.z);
		  }else{
			var camVec = new Vec3(camera.position.x,camera.position.y,camera.position.z);			  
		  }
		  var dist  = posVec.distanceTo(camVec);
		  
		  if(dist>50 && teleTo==0){
			 teleTo=1;
			setTimeout(function(){
			scene.remove(botMesh);
			botMesh=0;
			teleTo=0;
			camera.position.set(pos.x, pos.y + 20, pos.z + 20)  
			},100);
		  }
	  }
    if (yaw !== undefined && pitch !== undefined && firstPerson==true) {
		
		camera.position.set(pos.x, pos.y + 1.6, pos.z)
	 
	/* if(lastPitch != pitch){
	  camera.rotation.x = camera.rotation.x * 0.9 + pitch * 0.1
		lastPitch = pitch;
	 }
	 
	 if(lastYaw != yaw){
	  camera.rotation.y = camera.rotation.y * 0.9 + yaw * 0.1
	 lastYaw=yaw; 
	 }*/
	 
	 if(controlled == 0){
	 
	 camera.rotation.x = pitch;
	 camera.rotation.y = yaw;
	 
	 }
	 
	  camera.rotation.z = 0;
      return
    }
    if ( (pos.y > 0 && firstPositionUpdate) || follow) {
		controlsOrbit.target.set(pos.x, pos.y, pos.z)
      
		if(botMesh!=0){
		  camera.position.x += pos.x - botMesh.position.x;
		  camera.position.y += pos.y - botMesh.position.y;
		  camera.position.z += pos.z - botMesh.position.z;
		}
			  
	  
		if(firstPerson==true){
			controlsOrbit.update()
		}
		
		if(firstPositionUpdate==true){
			firstPositionUpdate = false	
			camera.position.set(pos.x, pos.y + 20, pos.z + 20)  
		}
    }
    if (addMesh) {
      if (!botMesh) {
        const geometry = new THREE.BoxGeometry(0.6, 1.8, 0.6)
        geometry.translate(0, 0.9, 0)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        botMesh = new THREE.Mesh(geometry, material)
        scene.add(botMesh)
      }
      botMesh.position.set(pos.x, pos.y, pos.z)
    }
  })

  socket.on('entity', (e) => {
    entities.update(e)
  })

  socket.on('primitive', (p) => {
    primitives.update(p)
  })

  socket.on('chunk', (data) => {
    const [x, z] = data.coords.split(',')
    world.addColumn(parseInt(x, 10), parseInt(z, 10), data.chunk)
  })

  socket.on('unloadChunk', ({ x, z }) => {
    world.removeColumn(x, z)
  })

  socket.on('blockUpdate', ({ pos, stateId }) => {
    world.setBlockStateId(new Vec3(pos.x, pos.y, pos.z), stateId)
  })
})
