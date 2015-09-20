var Drawing = function() {
	this.spheres = []
}

Drawing.prototype.pushSphere = function(sphere) {
	this.spheres.push(sphere);
	//console.log(sphere);
	for (i in sphere.position) {
		sphere.position[i] = sphere.position[i]/75;
	}
	addSphere(sphere.position, sphere.radius);
}