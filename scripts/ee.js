/**
 * ee.js
 * The end effector that needs to be re-configured.
 * Represented by a triangle.
 */

var isOneTouch = false;
var control = 2;
var controlTypes = ["arrows", "drag", "target"];

var ee = null;
var ring = null;
var target = null;

var isTranslating = false;
var isRotating = false;
var refPos = null;
var startRot = null;
var startPos = null;

var pos = null;
var rot = null;
var targetPos = null;
var targetRot = null;

// Radius and width of the control ring
var innerR = 30;
var ringWidth = 20;
// Top angle of the triangle representing the EE
var triAlpha = 45*Math.PI/180.0;
var triHeightDiff = Math.round(innerR*Math.cos(triAlpha));
var triWidth = Math.round((2*innerR-triHeightDiff)*Math.tan(triAlpha/2))*2;

function createEE() {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    ee = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    ee.setAttribute("id", "ee");
    ee.style.fill = "#ACC";
    ee.style.stroke = "#333";

    //Initialize end-effector
    pos = [Math.round(rect.width/2), Math.round(rect.height/2)];
    rot = 0;

    ee.setAttribute("class", "draggable");

    if (controlTypes[control] == "drag") {
        if (isOneTouch)
            ee.setAttributeNS(null, "onclick", "startDrag(evt)");
        else
            ee.setAttributeNS(null, "onmousedown", "startDrag(evt)");
        createRing();
    }
    else if (controlTypes[control] == "arrows") {
        ee.setAttributeNS(null, "onmousedown", "startArrowDrag(evt)");
        createArrows();
    }
    else {
        ws.setAttributeNS(null, "onmousemove", "drag(evt)");
    }

    ws.appendChild(ee);

    createTarget();
    resetPose();
}

function createArrows() {
    //TODO
}

function startArrowDrag() {
    //TODO
}

function startTargetDrag(evt) {
    console.log("We are moving, and the event is: " + evt);
    ee.setAttribute("transform", "translate(" + evt.offsetX + " " + evt.offsetY + ") rotate(" + rot + " " + 0 + " " + 0 + ")");
    if (isOneTouch)
        ee.setAttributeNS(null, "onclick", "pivot(evt)");
    else
        ee.setAttributeNS(null, "onmousedown", "pivot(evt)");
}

function createTarget() {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    targetPos = [innerR + Math.random()*(rect.width - 2*innerR), innerR + Math.random()*(rect.height-2*innerR)];
    targetRot = Math.random()*360 - 180;
    target = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    target.setAttribute("id", "ee");
    target.setAttribute("stroke-width", 4);
    target.style.fill = "none";
    target.style.stroke = "#933";
    target.setAttribute("points", (-triWidth/2)+","+(-triHeightDiff)+","+(triWidth/2)+","+(-triHeightDiff)+","+ 0 +","+ (innerR));
    target.setAttribute("transform", "translate(" + targetPos[0] + " " + targetPos[1] + ") rotate(" + targetRot + " " + 0 + " " + 0 + ")");
    //Initialize end-effector
    ws.appendChild(target);
}

function createRing() {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("id", "ring");
    ring.setAttribute("cx", Math.round(rect.width/2));
    ring.setAttribute("cy", Math.round(rect.height/2));
    ring.setAttribute("r", innerR + ringWidth/2);
    ring.setAttribute("stroke-width", ringWidth);
    ring.style.fill = "none";
    ring.style.stroke = "#AAC";
    ring.setAttribute("class", "draggable");
    if (isOneTouch)
        ring.setAttributeNS(null, "onclick", "startRotate(evt)");
    else
        ring.setAttributeNS(null, "onmousedown", "startRotate(evt)");
    ws.appendChild(ring);
}

function resetPose() {
    var x = 0;
    var y = 0;
    ee.setAttribute("points", (x-triWidth/2)+","+(y-triHeightDiff)+","+(x+triWidth/2)+","+(y-triHeightDiff)+","+(x)+","+(y+innerR));
    ee.setAttribute("transform", "translate(" + pos[0] + " " + pos[1] + ") rotate(" + rot + " " + 0 + " " + 0 + ")");
    if(ring) {
        ring.setAttribute("cx", pos[0]);
        ring.setAttribute("cy", pos[1]);
    }

    if(goalReached(pos[0], pos[1], targetPos[0], targetPos[1], rot, targetRot)){
        target.style.stroke = "#393";
    }
    else {
        target.style.stroke = "#933";
    }
}

function pivot(evt) {

    var ws = document.getElementById("workspace");
    ws.setAttributeNS(null, "onmousemove", "point(evt)");
}

function point(evt) {
    console.log(evt);
}

function startDrag(evt) {
    console.log("drag starts");
    isTranslating = true;
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    refPos = [mouseX, mouseY];
    startPos = pos;

    ws.setAttributeNS(null, "onmousemove", "drag(evt)");

    if (isOneTouch)
        ee.setAttributeNS(null, "onclick", "stopDrag(evt)");
    else
        ws.setAttributeNS(null, "onmouseup", "stopDrag(evt)");

    ee.style.fill = "#9EE";
}

function startRotate(evt) {
    isRotating = true;
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    refPos = [mouseX, mouseY];
    startPos = pos;
    startRot = rot;
    var ws = document.getElementById("workspace");
    ws.setAttributeNS(null, "onmousemove", "rotate(evt)");

    if (isOneTouch) {
        ring.setAttributeNS(null, "onclick", "stopRotate(evt)");
    }
    else
        ws.setAttributeNS(null, "onmouseup", "stopRotate(evt)");
    ring.style.stroke = "#99E";
}

function drag(evt) {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    var newPoint = [mouseX, mouseY];
    var a = diff(newPoint, refPos);
    pos = [startPos[0]+a[0], startPos[1]+a[1]];
    console.log("moved");
    resetPose();
}

// Check if target is reached
function goalReached(currPoseX, currPoseY, goalPoseX, goalPoseY, currRot, goalRot){
    var threshold = 3;
    var xErr = Math.abs(currPoseX-goalPoseX);
    var yErr = Math.abs(currPoseY-goalPoseY);
    var rotErr = Math.abs(currRot-goalRot);

    return (xErr < threshold && yErr < threshold && rotErr < threshold);

}

function rotate(evt) {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    var newPoint = [mouseX, mouseY];
    var centerPoint = pos;
    var a = diff(newPoint, refPos);
    var aUnit = [a[0]/length(a),a[1]/length(a)];
    var b = diff(newPoint, centerPoint);
    var c = diff(refPos, centerPoint);
    var cUnitOrth = [c[1]/length(c), -c[0]/length(c)];
    var alphaSign = -Math.sign(dot(cUnitOrth, b));
    var dist = dot(aUnit,b);
    var alpha1 = Math.asin(dist/length(b));
    var alpha2 = Math.asin((length(a)-dist)/length(c));
    var alpha = alphaSign*(alpha1+alpha2);
    var alphaDeg = Math.round(180.0*alpha/Math.PI);

    if (!isNaN(alpha)) {
        rot = startRot + alphaDeg;

        if (rot > 180)
            rot -= 360;
        if (rot < -180)
            rot += 360;

        resetPose();
    }
}

function dot(p1, p2) {
    return (p1[0]*p2[0])+(p1[1]*p2[1]);
}

function diff(p1, p2) {
    return [(p1[0]-p2[0]), (p1[1]-p2[1])];
}

function length(v1) {
    return Math.sqrt(Math.pow(v1[0],2) + Math.pow(v1[1],2));
}

function dist(p1, p2) {
    return Math.sqrt(Math.pow((p1[0]-p2[0]),2) + Math.pow((p1[1]-p2[1]),2));
}

function stopDrag(evt) {
    if (isTranslating) {
        var ws = document.getElementById("workspace");
        ws.removeAttributeNS(null, "onmousemove");

        if (isOneTouch) {
            ee.setAttributeNS(null, "onclick", "startDrag(evt)");
        }
        else {
            ws.removeAttributeNS(null, "onmouseup");
        }

        ee.style.fill = "#ACC";
        isTranslating = false;
    }
}

function stopRotate(evt) {
    if (isRotating) {
        var ws = document.getElementById("workspace");
        ws.removeAttributeNS(null, "onmousemove");
        if (isOneTouch) {
            ring.setAttributeNS(null, "onclick", "startRotate(evt)");
            ws.removeAttributeNS(null, "onclick");
        }
        else
            ws.removeAttributeNS(null, "onmouseup");
        isRotating = false;
        ring.style.stroke = "#AAC";
    }
}
