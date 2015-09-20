// var connection = new WebSocket('ws://127.0.0.1:9999');
var controller = new Leap.Controller();
var currentRadius;
var defaultRadius = 0.15;
var data = [];
var endpoints = [];
var isDrawing = false;
var drawing = new Drawing();
var counter = 0;
var threshold = 200;

controller.on('frame', function(frame) {
    if (frame.pointables.length > 0) {
        var pen = frame.pointables[0];
        var radius = currentRadius || defaultRadius;
        var position = pen.stabilizedTipPosition;
        var direction = pen.direction;
        var length = pen.length;
        var width = pen.width;
        var speed = pen.tipVelocity;
        //console.log(speed)
        var touchDistance = pen.touchDistance;
        var zone = pen.touchZone;
        if (isDrawing) {
            if (data.length == 0) {
                data.push({
                    radius: radius,
                    position: position,
                    speed: speed,
                    direction: direction
                });
            } else {
                prevPos = data[data.length - 1].position
                if (endpoints.length == 0) {
                    drawing.drawSphere({
                        position: position,
                        radius: radius
                    });
                    endpoints.push({
                            radius: radius,
                            position: position
                    })
                } else if (distance(position, prevPos) > radius) {
                    if (speed[0]^2 + speed[1]^2 + speed[2]^2 < threshold) {
                        endpoints.push({
                            radius: radius,
                            position: position
                        })
                    }
                    drawing.drawSphere({
                        position: position,
                        radius: radius
                    });
                }
            }
        }
    }
});
controller.connect();

const min_pot = 33;
const max_pot = 867;
const min_radius = 0.1;
const max_radius = 0.75;

/* var updatePen = function() {
    connection.send("ping");
    connection.onmessage = function(event) {
        //var pot = event.data.split(' ')[0];
        //currentRadius = (pot - min_pot)/(max_pot - min_pot)*(max_radius - min_radius) + min_radius
        //isDrawing = event.data.split(' ')[1] == 1;
    }
} */
 
var penOff = function() {
    console.log("Pen is OFF")
    if (endpoints.length >= 2) {
        //drawing.drawLine(endpoints[endpoints.length-1], endpoints[0]);
    }
    endpoints = [];
    isDrawing = false;
}
var penOn = function() {
    console.log("Pen is ON")
    isDrawing = true;
}

$(function() {
  $(document).keyup(function(evt) {
    if (evt.keyCode == 32) {
      penOff();
    }
  }).keydown(function(evt) {
    if (evt.keyCode == 32) {
      penOn();
    }
  });
});

// setTimeout(updatePen, 300)
