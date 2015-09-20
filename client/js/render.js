// THIS CAN BE USED TO RUN THE RENDERER

//set our globals

var scene, renderer, camera, controls, stats, numberOfSpheres, allSpheres, undoStack, redoStack, validRedo, pointerSphere, POINTER_MATERIAL, SPHERERADIUS, MATERIAL;

//initialize all our stuff with constants and such
function init() {
	//world
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//set our constants for sphere, etc. (globals)
	numberOfSpheres = 0;
	allSpheres = []; // (stores all geometries)
	undoStack = []; // stores undo meshes
	redoStack = []; // stores redo meshes
	validRedo = false; // switch to keep track of whether there are valid redos in stack
	SPHERERADIUS = 0.1; //default? If we end up storing this here.
	MATERIAL = new THREE.MeshPhongMaterial( { color: 0xffffff } );
	
	//and our pointer sphere
	POINTER_MATERIAL = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
	pointerSphere = new THREE.Mesh(new THREE.SphereGeometry(SPHERERADIUS), POINTER_MATERIAL);
	scene.add( pointerSphere );

	//lights!
	var light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.set( 10, 0, 10 );

	//camera!
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	camera.position.z = 5;
	camera.add( light );
	scene.add( camera )

	//action! (actually, just the dragging thing)
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );

	//diagnostic window
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );
}

// I think this works like a timer? It ticks every so often.
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    stats.update();
}

// so our mouse event works?
function animate() {
    requestAnimationFrame(animate);
    controls.update();
}

// TO BE CALLED TO DRAW
function changeSphereSize(n) {
    console.log("Changed sphere size from " + SPHERERADIUS + " to " + n);
    if (pointerSphere != null) {
        pointerSphere.scale.set(n / SPHERERADIUS, n / SPHERERADIUS, n / SPHERERADIUS);
    }
    SPHERERADIUS = n;
}

//TO BE CALLED TO DRAW
function addSphere(position, radius) {
	var sphereGeometry = new THREE.SphereGeometry( radius );
	sphereGeometry.translate(position[0], position[1], position[2]); //must set position through here
	var sphere = new THREE.Mesh( sphereGeometry, MATERIAL );
	allSpheres.push(sphereGeometry);
	scene.add( sphere );
	undoStack.push( sphere );
	numberOfSpheres++;
	if (validRedo) {
		validRedo = false;
		redoStack = [];
	}
}

// TO BE CALLED TO DRAW
function pointerOn(position, radius) {
    try {
        scene.remove(pointerSphere)
        var pointerMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            opacity: 0.5,
        });
        pointerSphere = new THREE.Mesh(new THREE.SphereGeometry(radius), pointerMaterial);
        pointerSphere.position.set(position[0], position[1], position[2]);
        scene.add(pointerSphere);
    } catch (e) {

    }
}

function pointerOff(position, radius) {
    try {
        scene.remove(pointerSphere)
        var pointerMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            opacity: 0.5,
        });
        pointerSphere = new THREE.Mesh(new THREE.SphereGeometry(radius), pointerMaterial);
        pointerSphere.position.set(position[0], position[1], position[2]);
        scene.add(pointerSphere);
    } catch (e) {

    }
}

//BEAMS
var currentBeam = null;
var currentBeamStart = {};
var BEAM_MATERIAL = new THREE.MeshLambertMaterial({
    color: 0xffffff
})

// TO BE CALLED TO DRAW
function startBeam(position) {
    if (currentBeam != null) {
        //console.log("You already had a beam started!");
    }

    currentBeamStart = new THREE.Vector3(position[0], position[1], position[2]);
    var currentBeamGeometry = new THREE.CylinderGeometry(SPHERERADIUS, SPHERERADIUS, 0.01);
    //currentBeamGeometry.translate(currentBeamStart.x, currentBeamStart.y, currentBeamStart.z);
    currentBeam = new THREE.Mesh(currentBeamGeometry, BEAM_MATERIAL);
    //for some reason the following line doesn't work when the documentation says it should...
    //currentBeam.position = currentBeamStart;
    //so we use this instead...
    currentBeam.position.set(currentBeamStart.x, currentBeamStart.y, currentBeamStart.z);
    scene.add(currentBeam);
    //console.log("Started current beam at (" + currentBeam.position.x + "," + currentBeam.position.y + "," + currentBeam.position.z + ")");
	if (currentBeam != null) {
		// console.log("You already had a beam started!");
	}
	
	currentBeamStart = new THREE.Vector3(position[0], position[1], position[2]);
	var currentBeamGeometry = new THREE.CylinderGeometry(SPHERERADIUS, SPHERERADIUS, 0.01);
	currentBeamGeometry.translate(currentBeamStart.x, currentBeamStart.y, currentBeamStart.z);
	currentBeam = new THREE.Mesh( currentBeamGeometry, POINTER_MATERIAL );
	//for some reason the following line doesn't work when the documentation says it should...
	//currentBeam.position = currentBeamStart;
	//so we use this instead...
	//currentBeam.position.set(currentBeamStart.x, currentBeamStart.y, currentBeamStart.z);
	scene.add( currentBeam );
	// console.log("Started current beam at (" + currentBeam.position.x + "," + currentBeam.position.y + "," + currentBeam.position.z + ")");
}

// TO BE CALLED TO DRAW
function moveBeam(position) {
	if (currentBeam != null) {
		var currentBeamEnd = new THREE.Vector3(position[0], position[1], position[2]);
		var direction = new THREE.Vector3().subVectors( currentBeamEnd, currentBeamStart );
		// Arrow method doesn't work! Using lookAt() instead!
    	//var arrow = new THREE.ArrowHelper( direction, currentBeamStart );
		//console.log("Direction: " + direction.length());
		var currentBeamGeometry = new THREE.CylinderGeometry(SPHERERADIUS, SPHERERADIUS, direction.length());
		currentBeam.matrixAutoUpdate = true;
		currentBeamGeometry.rotateX( Math.PI / 2 ) //I don't know why this works!!!!! (I think lookat fixes a lateral side?)
		//center is halfway there between start and end
		var centerVector = new THREE.Vector3().addVectors( currentBeamStart, direction.multiplyScalar(0.5) );
		//currentBeamGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(centerVector.x, centerVector.y, centerVector.z));
		scene.remove(currentBeam);
		currentBeam = new THREE.Mesh( currentBeamGeometry, POINTER_MATERIAL );
		currentBeam.position.set(centerVector.x, centerVector.y, centerVector.z);
		//currentBeam.rotation.set(arrow.rotation.x, arrow.rotation.y, arrow.rotation.z);
		/*
		console.log(arrow.rotation);
		console.log(currentBeam.rotation);
		console.log(currentBeam.rotation.x);
		console.log(currentBeam.rotation.y);
		console.log(currentBeam.rotation.z);
		*/
		//scene.add(currentBeam);
		
		currentBeam.lookAt(currentBeamEnd);
		scene.add( currentBeam );
		//console.log("Moving beam to (" + currentBeam.position.x + "," + currentBeam.position.y + "," + currentBeam.position.z + ")");
	}
	else {
		//console.log("You had no beam started!");
	}
}

// TO BE CALLED TO DRAW
function drawBeam() {
	if (currentBeam != null) {
		currentBeam.material = MATERIAL;
		var geometry = currentBeam.geometry.clone();
		// gotta follow exact steps taken in the source code for lookAt()
		geometry.rotateX(Math.PI / 2);
		geometry.applyMatrix(new THREE.Matrix4().makeRotationFromQuaternion(currentBeam.quaternion));
		geometry.translate(currentBeam.position.x, currentBeam.position.y, currentBeam.position.z);
		
		allSpheres.push(geometry);
		undoStack.push(currentBeam);
		if (validRedo) {
			validRedo = false;
			redoStack = [];
		}
		numberOfSpheres++;
		currentBeam = null;
	}
	else {
//		console.log("You had no beam started!");
	}
}

// TO BE CALLED TO UNDO 
function undo() {
	if (undoStack.length != 0) {
		console.log("undo!");
		undone = undoStack.pop();
		allSpheres.pop();
		scene.remove( undone );
		redoStack.push( undone );
		validRedo = true;
		numberOfSpheres--;
	}
}

// TO BE CALLED TO REDO
function redo() {
	if (validRedo && redoStack.length != 0) {
		console.log("redo!");
		redone = redoStack.pop();
		allSpheres.push( redone.geometry );
		scene.add( redone );
		undoStack.push( redone );
		numberOfSpheres++;
	}
}
//call our functions
init();
animate();
render();
