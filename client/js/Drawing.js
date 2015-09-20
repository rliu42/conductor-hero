var Drawing = function() {
    this.objects = []
}

Drawing.prototype.drawSphere = function(sphere) {
    this.objects.push(sphere);
    mapPos = mapPosition(sphere.position)
    //console.log(mapPos, sphere.radius)
    addSphere(mapPos, sphere.radius);
}

Drawing.prototype.beginBeam = function(center, radius) {

}

var scale = {
    x: 60,
    y: 50,
    z: 40
}
var translate = {
    x: -3,
    y: -3,
    z: 0
}

function mapPosition(position) {
    //console.log(position)
    position[0] = position[0] / scale.x + translate.x
    position[1] = position[1] / scale.y + translate.y
    position[2] = position[2] / scale.z +                                                       translate.z
    return position
}

Drawing.prototype.drawBeam = function(startSphere, endSphere) {
    //console.log(startSphere, endSphere)
    this.drawSphere(startSphere);
    this.drawSphere(endSphere);
}
