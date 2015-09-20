var controller = new Leap.Controller();
var defaultRadius = 0.1;
var data = [];
var drawing = new Drawing()
var counter = 0;

controller.on('frame', function(frame) {
    counter = counter + 1 %
    if (frame.pointables.length > 0) {
        var pen = frame.pointables[0]
        var radius = getRadius() || defaultRadius
        var position = pen.stabilizedTipPosition
        data.push({
            radius: radius,
            position: position,
            drawing: isDrawing()
        });
        if (isDrawing()) {
            drawing.pushSphere({position: position, radius: radius})
        }
    }
});
controller.connect();

var getRadius = function() {
    return 0;
}

var isDrawing = function() {
    return true;
}
