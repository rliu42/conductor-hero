// THIS CAN BE USED TO RUN THE RENDERER

//set our globals
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

//set our constants for sphere, etc. (globals)
var numberOfSpheres = 0;
var SPHERERADIUS = 0.1; //default? If we end up storing this here.
var MATERIAL = new THREE.MeshPhongMaterial();

//call our functions
init();
animate();
render();

//initialize lights, the dragging camera thing, and the diagnostic window
function init() {
	//lights!
	var light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.set( 10, 0, 10 );
	scene.add( light );

	//dragging thing
	var controls = new THREE.TrackballControls( camera );

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
	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );
}

// I think this works like a timer? It ticks every so often.
function render() {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
	stats.update();
}

// so our mouse event works?
function animate() {
	requestAnimationFrame( animate );
	controls.update();
}

// TO BE CALLED TO DRAW
function changeSphereSize(n) {
	console.log("Changed sphere size from " + SPHERERADIUS + " to " + n);
	SPHERERADIUS = n;	
}

//TO BE CALLED TO DRAW
function addSphere(x,y,z,radius) {
	console.log("Adding a sphere to (" + x + "," + y + "," + z + ") with radius " + radius);
	var sphereGeometry = new THREE.SphereGeometry( radius );
	var sphere = new THREE.Mesh( sphereGeometry, MATERIAL );
	sphere.position.set(x,y,z);
	scene.add( sphere );
	/*
	// Do we need these here?
	render();
	*/
}
