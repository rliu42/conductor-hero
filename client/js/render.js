// THIS CAN BE USED TO RUN THE RENDERER

//set our globals
var scene, renderer, camera, controls, stats, numberOfSpheres, allSpheres, pointerSphere, SPHERERADIUS, MATERIAL, pointerSphere;

//initialize all our stuff with constants and such
function init() {
    //world
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //set our constants for sphere, etc. (globals)
    numberOfSpheres = 0;
    allSpheres = []; // (stores all geometries)
    SPHERERADIUS = 0.1; //default? If we end up storing this here.
    MATERIAL = new THREE.MeshPhongMaterial();

    //and our pointer sphere
    var pointerMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparency: true
    });
    pointerSphere = new THREE.Mesh(new THREE.SphereGeometry(SPHERERADIUS), pointerMaterial);
    scene.add(pointerSphere);

    //lights!
    var light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 0, 10);
    scene.add(light);

    //camera!
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    //action! (actually, just the dragging thing)
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];
    controls.addEventListener('change', render);

    //diagnostic window
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);
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
    var sphereGeometry = new THREE.SphereGeometry(radius);
    sphereGeometry.translate(position[0], position[1], position[2]);
    var sphere = new THREE.Mesh(sphereGeometry, MATERIAL);
    sphere.position.set(position[0], position[1], position[2]);
    scene.add(sphere);
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

//call our functions
init();
animate();
render();
