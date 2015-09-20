var Drawing = function() {
    this.objects = []
    this.endpoints = [];
}

Drawing.prototype.drawSphere = function(sphere) {
    console.log(sphere);
    this.objects.push(sphere);
    addSphere(mapPosition(sphere.position), sphere.radius);
}

Drawing.prototype.drawRing = function(center, ringRadius, tubeRadius) {
	var geometry = new THREE.TorusGeometry( ringRadius, tubeRadius, 16, 100 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
	var torus = new THREE.Mesh( geometry, material );
	center = mapPosition(center)
	torus.position.set(center[0], center[1], center[2]);
	scene.add( torus );
}

Drawing.prototype.startBeam = function(center, radius) {
    this.endpoints.push(center);
    startBeam(mapPosition(center))
}

Drawing.prototype.moveBeam = function(center, radius) {
    moveBeam(mapPosition(center))
}

Drawing.prototype.drawBeam = function(start, end, radius) {
    addSphere({position: start.position, radius: 1.5});
    addSphere({position: end.position, radius: 1.5});
    this.endpoints.push(end.position)
    drawBeam();
}

var scale = {
    x: 40,
    y: 25,
    z: 40
}
var translate = {
    x: -2,
    y: -5,
    z: 0
}

function mapPosition(position) {
	map = []
    map[0] = position[0] / scale.x + translate.x
    map[1] = position[1] / scale.y + translate.y
    map[2] = position[2] / scale.z + translate.z
    return map
}
