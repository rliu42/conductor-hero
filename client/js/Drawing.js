var Drawing = function() {
    this.objects = []
}

Drawing.prototype.drawSphere = function(sphere) {
    this.objects.push(sphere);
    mapPos = mapPosition(sphere.position)
    //console.log(mapPos, sphere.radius)
    addSphere(mapPos, sphere.radius);
}

Drawing.prototype.drawRing = function(center, ringRadius, tubeRadius) {
	var geometry = new THREE.TorusGeometry( ringRadius, tubeRadius, 16, 100 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	var torus = new THREE.Mesh( geometry, material );
	center = mapPosition(center)
	torus.position.set(center[0], center[1], center[2]);
	scene.add( torus );
}

Drawing.prototype.beginBeam = function(center, radius) {
    return;
}

Drawing.prototype.endBeam = function(center, radius) {
    return;
}

Drawing.prototype.drawBeam = function(start, end, radius) {
    //console.log(startSphere, endSphere)
    this.drawSphere(startSphere);
    this.drawSphere(endSphere);
}

var scale = {
    x: 40,
    y: 25,
    z: 40
}
var translate = {
    x: -2,
    y: -4,
    z: 0
}

function mapPosition(position) {
	map = []
    map[0] = position[0] / scale.x + translate.x
    map[1] = position[1] / scale.y + translate.y
    map[2] = position[2] / scale.z + translate.z
    return map
}
