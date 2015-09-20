// var connection = new WebSocket('ws://127.0.0.1:9999');
var controller = new Leap.Controller();
var currentRadius = 0.5;
var defaultRadius = 0.18;
var data = [];
var endpoints = [];
var isDrawing = false;
var drawingRing = false;
var drawingBeam = false;
var drawingSphere = false;
var drawing = new Drawing();
var counter = 0;
var threshold = 200;
var pointers = 0;

var CtrlDown = false;
$(function() {
    $(document).keyup(function(evt) {
        if (evt.keyCode == 17) {
            CtrlDown = false
        }
    }).keydown(function(evt) {
        if (evt.keyCode == 17) {
            CtrlDown = true
        }
        else if (evt.keyCode == 38) { //up key
            increaseRadius();
            console.log("Increasing Radius: " + currentRadius);
        }
        else if (evt.keyCode == 40) { //down key
            decreaseRadius();
            console.log("Decreasing Radius: " + currentRadius);
        }
        if (CtrlDown && evt.keyCode == 90) {
            undo();
        } else if (CtrlDown && evt.keCcode == 89) {
            redo();
        }
    })
})

var saveSTLinProgress = false;

function saveStl() {
    var stlString = "solid\n";
    console.log(allSpheres);
    for (i = 0; i < allSpheres.length; i++) {
        geometry = allSpheres[i];
        console.log(geometry);
        stlString += generateSTL(geometry);
    }
    stlString += "endsolid";
    var blob = new Blob([stlString], {
        type: 'text/plain'
    });
    saveAs(blob, 'mesh.stl');
}

function onSaveKeyDown(e) {
    // yes, we are designating key Z to be the save key here
    if (!saveSTLinProgress && String.fromCharCode(e.keyCode) === 'S') {
        saveSTLinProgress = true; //lolol our primitive lock
        saveStl();
        saveSTLinProgess = false;
    }
    if (String.fromCharCode(e.keyCode) === 'R') {
        //alert('Drawing Sphere')
        if (drawingSphere) {
            isDrawing = false;
            drawingSphere = false;
            drawingBeam = true;
        }
        else {
            isDrawing = true;
            drawingSphere = true;
            drawingBeam = false;
            console.log("R hit! " + isDrawing + " " + drawingSphere);
        }
    }
}
document.addEventListener("keydown", onSaveKeyDown, false);

function getPointers(pointables) {
    count = 0
    for (var i in pointables) {
        if (!pointables[i].tool && pointables[i].direction[2] < -0.7) {
            count += 1
        }
    }
    return count;
}

function existsTool(pointables) {
    for (var i in pointables) {
        if (pointables[i].tool) {
            return pointables[i];
        }
    }

    return null;
}

controller.on('frame', function(frame) {
    if (frame.pointables.length > 0) {
        if (frame.pointables.length > 1) {
            penOn();
            tool = existsTool(frame.pointables);
            pointers = getPointers(frame.pointables);
            if (drawingSphere && endpoints.length > 1 && tool) {
                console.log("Drawing sphere");
                console.log(tool);
                drawing.drawSphere({position: tool.stabilizedTipPosition, radius: currentRadius*2});
            }
        } else {
            console.log(drawingSphere);
            penOff();
        }
        if (pointers >= 2 && !drawingSphere) {
            drawingBeam = true;
        } else {
            drawingBeam = false;
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
            if (isDrawing) {
                pointerOn(mapPosition(position), radius);
                if (data.length == 0) {
                    data.push({
                        radius: radius,
                        position: position,
                        speed: speed,
                        direction: direction
                    });
                } else {
                    //prevPos = data[data.length - 1].position
                    //distanceBetween = distance(mapPosition(position), mapPosition(prevPos))
                    if (endpoints.length == 0) {
                        endpoints.push({
                            radius: radius,
                            position: position
                        });
                        if (drawingBeam) {
                            position = infer(position, drawing.endpoints)
                            drawing.startBeam(position, radius)
                        }
                    } else {
                        endpoints.push({
                            radius: radius,
                            position: position
                        });
                        if (drawingBeam) {
                            position = infer(position, drawing.endpoints)
                            drawing.moveBeam(position, radius);
                        }
                    }
                }
            } else {
                penOff();
                pointerOff(mapPosition(position), radius);
            }
        }
    } else {
        penOff();
    }
});

controller.on("gesture", function(gesture) {
    switch (gesture.type) {
        case "circle":
            if (gesture.state == 'stop' && isDrawing && !drawingBeam) {
                //drawing.drawRing(gesture.center, gesture.radius / 30, currentRadius || defaultRadius)
                //console.log("Circle Gesture");
            }
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

//hotkeys for +/- radius size
function increaseRadius() {
    if (currentRadius < max_radius) {
        currentRadius+=0.05;
        changeSphereSize(currentRadius);
    }
}

function decreaseRadius() {
    if (currentRadius > min_radius) {
        currentRadius-=0.05;
        changeSphereSize(currentRadius);
    }
}



var penOff = function() {
    if (!drawingSphere && endpoints.length >= 2) {
        drawing.drawBeam(endpoints[0], infer(endpoints[endpoints.length - 1], drawing.endpoints), currentRadius);
    }
    if (drawingSphere && endpoints.length >= 1) {
        console.log("Drawing sphere")
        drawing.drawSphere({position: infer(endpoints[endpoints.length - 1], drawing.endpoints), radius: currentRadius*2});
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
    if (drawingBeam && endpoints.length >= 2) {
        drawing.drawBeam(endpoints[0], infer(endpoints[endpoints.length - 1], drawing.endpoints), currentRadius);
    }
    endpoints = []
    drawingBeam = false;
}
