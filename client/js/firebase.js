/* Functions that interact with Firebase */

var firstLoad = true
var root = new Firebase("https://leap-cad.firebaseio.com")

root.on("value", function(ss) {
    if (!firstLoad) {
        var spheres = ss.val();
        lastSphere = spheres[spheres.length - 1]
        renderSphere(lastSphere.radius, lastSphere.position)
    } else {
        firstLoad = false
    }
});
