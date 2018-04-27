/**
 * ee.js
 * The end effector that needs to be re-configured.
 * Represented by a triangle.
 */

var isOneTouch = false;
var control = 0;
var controlTypes = ["arrows", "drag", "target", "cardinal_speech", "trajectory_speech", "grid_speech"];


var ee = null;
var ring = null;
var target = null;

var score = 0;

var isTranslating = false;
var isRotating = false;
var refPos = null;
var startRot = null;
var startPos = null;

var pos = null;
var rot = null;
var targetPos = null;
var targetRot = null;

// The global variables used by the arrows
var scale = 1;
var arrowRight;
var arrowLeft;
var arrowUp;
var arrowDown;
var arrows;

var arrowRightXOffset;
var arrowRightYOffset;
var arrowLeftXOffset;
var arrowLeftYOffset;
var arrowUpXOffset;
var arrowUpYOffset;
var arrowDownXOffset;
var arrowDownYOffset;

// Constant variables for the arrows
const HORIZONTAL = 0;
const VERTICAL = 1;

// The global variables used by the target control type
var targetFixedX = null;
var targetFixedY = null;

// Radius and width of the control ring
var innerR = 40;
var triangleSize = 30;
var ringWidth = 18;
var pointOffset = triangleSize - ringWidth;
// Top angle of the triangle representing the EE
var triAlpha = 45*Math.PI/180.0;
var triHeightDiff = Math.round(triangleSize*Math.cos(triAlpha));
var triWidth = Math.round((2*triangleSize-triHeightDiff)*Math.tan(triAlpha/2))*2;

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

    if (controlTypes[control] === "drag") {
        if (isOneTouch)
            ee.setAttributeNS(null, "onclick", "startDrag(evt)");
        else
            ee.setAttributeNS(null, "onmousedown", "startDrag(evt)");
        createRing();
    }
    else if (controlTypes[control] === "arrows") {
        ee.setAttributeNS(null, "onmousedown", "startArrowDrag(evt)");
        createRing();
        createArrows();
        if (isOneTouch) {

                arrowRight.setAttribute("onclick", "startDrag(evt, HORIZONTAL)");
                arrowLeft.setAttribute("onclick", "startDrag(evt, HORIZONTAL)");
                arrowUp.setAttribute("onclick", "startDrag(evt, VERTICAL)");
                arrowDown.setAttribute("onclick", "startDrag(evt, VERTICAL)");

        }
        else {

                arrowRight.setAttribute("onmousedown", "startDrag(evt, HORIZONTAL)");
                arrowLeft.setAttribute("onmousedown", "startDrag(evt, HORIZONTAL)");
                arrowUp.setAttribute("onmousedown", "startDrag(evt, VERTICAL)");
                arrowDown.setAttribute("onmousedown", "startDrag(evt, VERTICAL)");

        }
    }
    else if (controlTypes[control] === "target"){
        ws.setAttribute("onmousemove", "startTargetDrag(evt)");
    }
    else if (controlTypes[control] === "cardinal_speech"){

    }
    else if (controlTypes[control] === "trajectory_speech"){

    }
    else if (controlTypes[control] === "grid_speech"){

    }
    else {
        console.error("Please select a valid control");
    }

    ws.appendChild(ee);

    createTarget();
    resetPose();
}


function startArrowDrag() {
    //TODO
}

function startTargetDrag(evt) {
    console.log("We are moving, and the event is: " + evt);
    ee.setAttribute("transform", "translate(" + evt.offsetX + " " + evt.offsetY + ") rotate(" + rot + " " + 0 + " " + 0 + ")");
    checkGoal(evt.offsetX, evt.offsetY, targetPos[0], targetPos[1], rot, targetRot);
    //TODO Check to see if you made it
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
    target.setAttribute("id", "target");
    target.setAttribute("stroke-width", 4);
    target.style.fill = "none";
    target.style.stroke = "#933";
    target.setAttribute("points", (-triWidth/2)+","+(-triHeightDiff)+","+(triWidth/2)+","+(-triHeightDiff)+","+ 0 +","+ (innerR - pointOffset));
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

function createArrows() {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();

    // Arrow params
    var arrowLength = 22;
    var lipHeight = 6;
    var arrowheadLength = 22;
    var arrowWidth = 16;

    arrowRight = document.createElementNS('http://www.w3.org/2000/svg','path');
    arrowLeft = document.createElementNS('http://www.w3.org/2000/svg','path');
    arrowUp = document.createElementNS('http://www.w3.org/2000/svg','path');
    arrowDown = document.createElementNS('http://www.w3.org/2000/svg','path');

    arrowRight.setAttribute("d", "M0,"+(0)+" h"+arrowLength+"v"+(-lipHeight)+"l"+arrowheadLength+","+(lipHeight + (arrowWidth /2)) +"l"+ (-arrowheadLength)+","+(lipHeight + (arrowWidth /2)) +"v"+(-lipHeight)+"h"+(-arrowLength)+"z");
    arrowLeft.setAttribute("d", "M0,"+(0)+" h"+arrowLength+"v"+(-lipHeight)+"l"+arrowheadLength+","+(lipHeight + (arrowWidth /2)) +"l"+ (-arrowheadLength)+","+(lipHeight + (arrowWidth /2)) +"v"+(-lipHeight)+"h"+(-arrowLength)+"z");
    arrowUp.setAttribute("d", "M0,"+(0)+" h"+arrowLength+"v"+(-lipHeight)+"l"+arrowheadLength+","+(lipHeight + (arrowWidth /2)) +"l"+ (-arrowheadLength)+","+(lipHeight + (arrowWidth /2)) +"v"+(-lipHeight)+"h"+(-arrowLength)+"z");
    arrowDown.setAttribute("d", "M0,"+(0)+" h"+arrowLength+"v"+(-lipHeight)+"l"+arrowheadLength+","+(lipHeight + (arrowWidth /2)) +"l"+ (-arrowheadLength)+","+(lipHeight + (arrowWidth /2)) +"v"+(-lipHeight)+"h"+(-arrowLength)+"z");

    arrowRight.style.fill = "#181acc";
    arrowLeft.style.fill = "#181acc";
    arrowUp.style.fill = "#cc070e";
    arrowDown.style.fill = "#cc070e";

    ws.appendChild(arrowRight);
    ws.appendChild(arrowLeft);
    ws.appendChild(arrowUp);
    ws.appendChild(arrowDown);

    arrowRightXOffset = innerR + ringWidth;
    arrowRightYOffset = - arrowWidth / 2;
    arrowLeftXOffset = - (innerR + ringWidth);
    arrowLeftYOffset =  arrowWidth / 2;
    arrowUpXOffset = - arrowWidth / 2;
    arrowUpYOffset =  - (innerR + ringWidth);
    arrowDownXOffset = arrowWidth / 2;
    arrowDownYOffset = (innerR + ringWidth);


    arrowRight.setAttribute("transform", "translate(" + (arrowRightXOffset + Math.round(rect.width/2))
        + " " + (arrowRightYOffset + Math.round(rect.height/2))+ ") scale(" + scale + ")" + " rotate(90, 0, 0 )");
    arrowLeft.setAttribute("transform", "translate(" + (arrowLeftXOffset + Math.round(rect.width/2))
        + " " + (arrowLeftYOffset + Math.round(rect.height/2)) + ") scale(" + scale + ")");
    arrowUp.setAttribute("transform", "translate(" + (arrowUpXOffset + Math.round(rect.width/2))
        + " " + (arrowUpYOffset + Math.round(rect.height/2)) + ") scale(" + scale + ")");
    arrowDown.setAttribute("transform", "translate(" + (arrowDownXOffset + Math.round(rect.width/2))
        + " " + (arrowDownYOffset + Math.round(rect.height/2))+ ") scale(" + scale + ")");




    arrows = [arrowRight, arrowLeft, arrowUp, arrowDown];


}

function resetPose() {
    var x = 0;
    var y = 0;
    ee.setAttribute("points", (x-triWidth/2)+","+(y-triHeightDiff)+","+(x+triWidth/2)+","+(y-triHeightDiff)+","+(x)+","+(y+innerR - pointOffset));
    ee.setAttribute("transform", "translate(" + pos[0] + " " + pos[1] + ") rotate(" + rot + " " + 0 + " " + 0 + ")");
    if(ring) {
        ring.setAttribute("cx", pos[0]);
        ring.setAttribute("cy", pos[1]);
    }
    if(arrows){
        arrowRight.setAttribute("transform", "translate(" + (pos[0] + arrowRightXOffset) + " " + (pos[1] + arrowRightYOffset) + ") scale(" + scale + ")" );
        arrowLeft.setAttribute("transform", "translate(" + (pos[0] + arrowLeftXOffset) + " " + (pos[1] + arrowLeftYOffset) + ") scale(" + scale + ")" + " rotate(180, 0, 0 )");
        arrowUp.setAttribute("transform", "translate(" + (pos[0] + arrowUpXOffset) + " " + (pos[1] + arrowUpYOffset) + ") scale(" + scale + ")" + " rotate(-90, 0, 0 )");
        arrowDown.setAttribute("transform", "translate(" + (pos[0] + arrowDownXOffset) + " " + (pos[1] + arrowDownYOffset) + ") scale(" + scale + ")" + " rotate(90, 0, 0 )");
    }

    checkGoal(pos[0], pos[1], targetPos[0], targetPos[1], rot, targetRot);

}

function pivot(evt) {
    var ws = document.getElementById("workspace");
    targetFixedX = evt.offsetX;
    targetFixedY = evt.offsetY;
    ws.setAttribute("onmousemove", "point(evt)");
    if(!isOneTouch){
        ws.setAttribute("onmouseup", "stopPoint(evt)");
    }
}

function point(evt) {
    var ws = document.getElementById("workspace");
    var deltaX = evt.offsetX - targetFixedX;
    var deltaY = evt.offsetY - targetFixedY;
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    angle -= 90;
    rot = angle;

    if (rot > 180)
        rot -= 360;
    if (rot < -180)
        rot += 360;

    ee.setAttribute("transform", "translate(" + targetFixedX + " " + targetFixedY + ") rotate(" + rot + " " + 0 + " " + 0 + ")");
    checkGoal(targetFixedX, targetFixedY, targetPos[0], targetPos[1], rot, targetRot);
    if(isOneTouch){
        ws.setAttribute("onclick", "stopPoint(evt)");
    }
    else{
        ws.setAttribute("onmouseup", "stopPoint(evt)");
    }
}

function stopPoint(evt){
    var ws = document.getElementById("workspace");
    if(isOneTouch){
        ws.removeAttribute("onclick");
        ee.removeAttribute("onclick");
    }
    else{
        ws.removeAttribute("onmouseup");
        ee.removeAttribute("onmousedown");
    }
    ws.setAttribute("onmousemove", "startTargetDrag(evt)");
}

function startDrag(evt, direction) {
    console.log("drag starts");
    isTranslating = true;
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    refPos = [mouseX, mouseY];
    startPos = pos;


    if (direction == undefined ) {
        ws.setAttributeNS(null, "onmousemove", "drag(evt)");

        if (isOneTouch)
            ee.setAttributeNS(null, "onclick", "stopDrag(evt)");
        else
            ws.setAttributeNS(null, "onmouseup", "stopDrag(evt)");
        ee.style.fill = "#9EE";
    }else {
        ws.setAttributeNS(null, "onmousemove", "drag(evt, " + direction + ")");

        if(direction == HORIZONTAL){
            evt.target.style.fill = "#4a4aff"
        }
        else if(direction == VERTICAL){
            evt.target.style.fill = "#ff070e"
        }
        if (isOneTouch) {
            arrows.forEach(function(arrow) {
               arrow.setAttributeNS(null, "onclick", "stopDrag(evt, " + direction + ")");
            });
            ws.setAttribute("onclick", "stopDrag(evt, " + direction + ")");
            evt.stopPropagation();
        }
        else
            ws.setAttributeNS(null, "onmouseup", "stopDrag(evt, " + direction + ")");

    }

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

function drag(evt, direction) {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    var newPoint = [mouseX, mouseY];
    var a = diff(newPoint, refPos);

    if(direction == undefined) {
        pos = [startPos[0] + a[0], startPos[1] + a[1]];
    }
    else if(direction == HORIZONTAL){
        pos = [startPos[0] + a[0], startPos[1]];
    }else if(direction == VERTICAL){
        pos = [startPos[0], startPos[1] + a[1]];
    }else {
        console.error("Bad direction");
    }

    console.log("moved");
    resetPose();
}

function horizontalDrag(evt) {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    var newPoint = [mouseX, mouseY];
    var a = diff(newPoint, refPos);
    pos = [startPos[0]+a[0], startPos[1]];
    console.log("moved");
    resetPose();
}

// Check if target is reached
function checkGoal(currPoseX, currPoseY, goalPoseX, goalPoseY, currRot, goalRot){
    var threshold = 3;
    var xErr = Math.abs(currPoseX-goalPoseX);
    var yErr = Math.abs(currPoseY-goalPoseY);
    var rotErr = Math.abs(currRot-goalRot);

    console.log("xErr: " + xErr + "yErr: " + yErr+ "rotErr: " + rotErr);

    if(xErr < threshold && yErr < threshold && rotErr < threshold){
        success();
    }
    else{
        target.style.stroke = "#933";
    }

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

function stopDrag(evt, direction) {
    if (isTranslating) {
        var ws = document.getElementById("workspace");
        ws.removeAttributeNS(null, "onmousemove");

        if (direction == undefined) {
            if (isOneTouch) {
                ee.setAttributeNS(null, "onclick", "startDrag(evt)");
            }
            else {
                ws.removeAttributeNS(null, "onmouseup");
            }
        } else {

            if (isOneTouch) {
                arrowRight.setAttributeNS(null, "onclick", "startDrag(evt, HORIZONTAL)");
                arrowLeft.setAttributeNS(null, "onclick", "startDrag(evt, HORIZONTAL)");
                arrowUp.setAttributeNS(null, "onclick", "startDrag(evt, VERTICAL)");
                arrowDown.setAttributeNS(null, "onclick", "startDrag(evt, VERTICAL)");
            }
            else {
                ws.removeAttributeNS(null, "onmouseup");
            }
            arrowRight.style.fill = "#181acc";
            arrowLeft.style.fill = "#181acc";
            arrowUp.style.fill = "#cc070e";
            arrowDown.style.fill = "#cc070e";
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

function destroyEE() {

}


function success() {
    target.style.stroke = "#393";
    score++;
    console.log("SUCCESS!");
}
