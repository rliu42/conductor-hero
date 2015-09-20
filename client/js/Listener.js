// var connection = new WebSocket('ws://127.0.0.1:9999');
var controller = new Leap.Controller();
var currentRadius;
var defaultRadius = 0.18;
var data = [];
var endpoints = [];
var drawCircle = true;
var isDrawing = false;
var drawingBeam = false;
var drawing = new Drawing();
var counter = 0;
var threshold = 200;

controller.on('frame', function(frame) {
    if (frame.pointables.length > 0) {
        if (frame.pointables.length > 5) {
            penOn();
        } else {
            penOff();
        }
        var pen = frame.pointables.filter(function(value) {
            return value.tool
        })[0];
        if (pen) {
            var radius = currentRadius || defaultRadius;
            var position = pen.stabilizedTipPosition;
            var direction = pen.direction;
            var length = pen.length;
            var width = pen.width;
            var speed = pen.tipVelocity;
            var touchDistance = pen.touchDistance;
            var zone = pen.touchZone;
            pointerOn(mapPosition(position), radius);
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
                    distanceBetween = distance(mapPosition(position), mapPosition(prevPos))
                        //console.log(distanceBetween)
                    if (endpoints.length == 0) {
                        drawing.drawSphere({
                            position: position,
                            radius: radius
                        });
                        endpoints.push({
                            radius: radius,
                            position: position
                        })
                    } else if (distanceBetween > radius) {
                        if (speed[0] * speed[0] + speed[1] * speed[1] + speed[2] * speed[2] < threshold) {
                            endpoints.push({
                                radius: radius,
                                position: position
                            })
                        }
                        if (!drawingBeam) {
                            drawing.drawSphere({
                                position: position,
                                radius: radius
                            });
                        } else {
                            drawing.beginBeam(endpoints[0], radius)
                        }
                    }
                }
            } else {
                pointerOff(mapPosition(position), radius);
            }
        }
    }
});

controller.on("gesture", function(gesture) {
    switch (gesture.type) {
        case "circle":
            if (gesture.state == 'stop' && isDrawing) {
                drawing.drawRing(gesture.center, gesture.radius / 30, currentRadius || defaultRadius)
                console.log("Circle Gesture");
            }
            break;
        case "keyTap":
            console.log("Key Tap Gesture");
            break;
        case "screenTap":
            console.log("Screen Tap Gesture");
            break;
        case "swipe":
            console.log("Swipe Gesture");
            break;
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
    if (drawingBeam && endpoints.length >= 2) {
        drawing.drawBeam(endpoints[endpoints.length - 1], endpoints[0], currentRadius);
    }
    endpoints = [];
    drawingBeam = false;
    isDrawing = false;
}
var penOn = function() {
    isDrawing = true;
}

var beamOn = function() {
    isDrawing = true;
    drawingBeam = true;
}

var beamOff = function() {
    drawingBeam = false;
}

$(function() {
    $(document).keyup(function(evt) {
        if (evt.keyCode == 13) {
            penOff();
        }
    }).keydown(function(evt) {
        if (evt.keyCode == 13) {
            penOn();
        }
    });
});

// setTimeout(updatePen, 300)
