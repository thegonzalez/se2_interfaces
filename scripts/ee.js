/**
 * ee.js
 * The end effector that needs to be re-configured.
 * Represented by a triangle.
 */
var ws = document.getElementById("workspace");

var numFittsTargets=5;
var clickedNum=1;
var oddCount=1;
var evenCount=Math.ceil(numFittsTargets/2)+1;
var value=1;
var prevVal=1;
var targetEnd=0;
var currRoundFitts =0;
var maxRoundFitts =4;
var triangleTargetAngles = [45,180,-45];
var currTriFitts =0;
var maxTriFitts =4;

var currTargetCount =0;
var codeSTR= "";
var isOneTouch = false;

var control = 2;
var controlTypes = ["arrows", "drag", "fitts", "fittsAngle",   "target",
    "cardinal_speech", "trajectory_speech", "grid_speech", "VirtualTrackpad",
    "mouseTraj","tensorflowClassify", "tensorflowRegNN","keyboard"];

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

// Target Params
var targetPos = null;
var targetRot = null;
var targetRed = "#933";
var targetGreen = "#393";
var threshold = 3;


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
var ghost;
var lineThickness = 2;

// Arrow params
var arrowShaftLength = 22;
var lipHeight = 6;
var arrowheadLength = 22;
var arrowLengthTot = arrowShaftLength + arrowheadLength;
var arrowWidth = 16;

// Trajectory arrow params and variables
var numTrajArrows = 10;
var trajArrowLength = 100;
var trajFontSize = 30;
var trajArrows;
var trajNums;

// Radius and width of the control ring
var innerR = 40;
var triangleSize = 30;
var ringWidth = 18;
var pointOffset = triangleSize - ringWidth;

// Top angle of the triangle representing the EE
var triAlpha = 45*Math.PI/180.0;
var triHeightDiff = Math.round(triangleSize*Math.cos(triAlpha));
var triWidth = Math.round((2*triangleSize-triHeightDiff)*Math.tan(triAlpha/2))*2;

// Grid params
var gridSideLength = 3;

// Pie params
var numSlices = 4;

function createEE(value= 3) {
    //   console.log(getPermutation(allArrays));
    control = value;
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    ee = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    ee.setAttribute("id", "ee");
    ee.style.fill = "#b614cc";
    ee.style.stroke = "#333";

    //Initialize position of end-effector
    pos = [Math.round(rect.width / 2), Math.round(rect.height / 2)];
    rot = 0;

    ee.setAttribute("class", "draggable");

    if (control <4){
        //     document.getElementById("speechControls").style.visibility = "hidden";
    } else{
        //   document.getElementById("speechControls").style.visibility = "visible";
    }

    if(control == 7){
        //     document.getElementById("trajectoryControls").style.visibility = "visible";
    }else {
        //    document.getElementById("trajectoryControls").style.visibility = "hidden";
    }


    if (controlTypes[control] === "fitts") {
        createFittsTarget(0);
        //createIsoscelesTriangle();
        ws.addEventListener("click", getCircleClickedFitt);
    }else if (controlTypes[control] === "fittsAngle") {

        createFittsTriTarget(0);

        if(triangleTargetAngles.length%2==0){
            targetEnd=clickedNum;
        }else{
            targetEnd=clickedNum+1;
        }
        ws.addEventListener("click", getTriClickedFitt);
        // createFittsTarget(0);
        //createIsoscelesTriangle();
        //ws.addEventListener("click", getCircleClickedFitt);
    }
    else if (controlTypes[control] === "drag") {
        if (isOneTouch)
            ee.setAttributeNS(null, "onclick", "startDrag(evt)");
        else
            ee.setAttributeNS(null, "onmousedown", "startDrag(evt)");
        createRing();
    }
    else if (controlTypes[control] === "arrows") {
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
    else if (controlTypes[control] === "target") {
        createGhost();
        if(isOneTouch) {
            ws.setAttribute("onclick", "startGhost(evt)");
        }
        else {
            ws.setAttribute("onmousedown", "startGhost(evt)");
        }
    }
    else if (controlTypes[control] === "cardinal_speech") {
//        createCardinalSpeech();
    }
    else if (controlTypes[control] === "trajectory_speech") {
        createTrajectoryArrows();
        createTrajSpeech();
        var x = document.getElementById("rA");
        x.style.display = "none";
    }
    else if (controlTypes[control] === "grid_speech") {
        createGridSpeech();
        // addPie(0, 360, 4);
        addGrid(0, 0, rect.width, rect.height, gridSideLength);
    }
    else  if (controlTypes[control] === "mouseTraj") {

        cursorPos = [Math.round(rect.width / 2), Math.round(rect.height / 2)];
        var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        var rA = 100;
        var rB = -100;
        var position = [Math.round(rect.width / 2)+rA*Math.cos(0), Math.round(rect.height / 2)+rB*Math.sin(0)];


        if(isOneTouch) {
            ws.setAttribute("onclick", "beginDrag(evt)");
        }
        else {
            ws.setAttribute("onmousedown", "beginDrag(evt)");
        }
        var circle= document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute("cx", position[0]);
        circle.setAttribute("cy",position[1]-10);
        circle.setAttribute("r", "10");
        ws.appendChild(circle);


        var position = [Math.round(rect.width / 2)+rA*Math.cos(0), Math.round(rect.height / 2)+rB*Math.sin(0)];
        var position2 = [Math.round(rect.width / 2)+rA*Math.cos(45), Math.round(rect.height / 2)+rB*Math.sin(45)];
        var position3 = [Math.round(rect.width / 2)+rA*Math.cos(90), Math.round(rect.height / 2)+rB*Math.sin(90)];
        var position4 = [Math.round(rect.width / 2)+rA*Math.cos(135), Math.round(rect.height / 2)+rB*Math.sin(135)];
        var position5 = [Math.round(rect.width / 2)+rA*Math.cos(180), Math.round(rect.height / 2)+rB*Math.sin(180)];
        var position6 = [Math.round(rect.width / 2)+rA*Math.cos(225), Math.round(rect.height / 2)+rB*Math.sin(225)];
        var position7 = [Math.round(rect.width / 2)+rA*Math.cos(270), Math.round(rect.height / 2)+rB*Math.sin(270)];
        var position8 = [Math.round(rect.width / 2)+rA*Math.cos(285), Math.round(rect.height / 2)+rB*Math.sin(315)];
        var position9 = [Math.round(rect.width / 2)+rA*Math.cos(360), Math.round(rect.height / 2)+rB*Math.sin(360)];

        //this is where the numbers will be
        var i;
        var circleNum = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleNum.setAttribute("r", "10");

        var textNum =  document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textNum.setAttribute('fill', '#ffffff');
        textNum.textContent = '2';
        textNum.style.fontSize = "8px";
        for (i = 0; i <360; i=i+45) {
            console.log(i);
            var positionNum= [Math.round(rect.width / 2)+rA*Math.cos(i* Math.PI / 180),
                Math.round(rect.height / 2)+rB*Math.sin(i* Math.PI / 180)];

            var circleNum= document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circleNum.setAttribute("cx", positionNum[0]);
            circleNum.setAttribute("cy",positionNum[1]);
            circleNum.setAttribute("r", "20");
            ws.appendChild(circleNum);

            var text4 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text4.setAttribute('x',  positionNum[0]-10);
            text4.setAttribute('y', positionNum[1]+10);
            text4.setAttribute('fill', '#ffffff');
            text4.textContent = i;
            text4.style.fontSize = "5px";
            ws.appendChild(text4);/**/
            /*
                        circleNum.setAttribute("cx", positionNum[0]);
                        circleNum.setAttribute("cy", positionNum[1]-10);
                        ws.appendChild(circleNum);
                        textNum.setAttribute('x',  positionNum[0]-5);
                        textNum.setAttribute('y', positionNum[1]-5);
                        ws.appendChild(textNum);*//*
            var startPos1 = pos;

            var a = diff(positionNum, startPos1);
            var rA = a[0];
            var rB = a[1];
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            var pathString ="M"+ ((startPos1[0])) + " " + (startPos1[1]) +"a"+rA+","+rB +" 0 0,0 "+rA+","+rB;

            var magnitudeRadX= Math.abs(rA);
            var magnitudeRadY= Math.abs(rB);
            if (magnitudeRadX <= 100 && magnitudeRadY <= 100){
                pathString ="M"+ ((startPos1[0])) + " " + (startPos1[1])
                    +"A"+rA+","+rA +" 0 0,0 "+pos[0]+","+pos[1];
                path.setAttribute("stroke", "#2c42ff");
            } else {
                if(startPos1[0]>pos[0] && startPos1[1]>pos[1]){
                    path.setAttribute("stroke", "#ff24f9");
                    pathString ="M"+ ((startPos1[0])) + " " +
                        (startPos[1]) +"a"+rA+","+rB +" 0 0,1 "+rA+","+rB;
                }else if(startPos1[0]>pos[0] && startPos1[1]<=pos[1]) {
                    path.setAttribute("stroke", "#28932d");

                }else if(startPos1[0]<=pos[0] && startPos1[1]<=pos[1]) {
                    path.setAttribute("stroke", "#ffc816");
                    pathString ="M"+ ((startPos1[0])) + " " +
                        (startPos1[1]) +"a"+rA+","+rB +" 0 0,1 "+rA+","+rB;
                }else if (startPos1[0]<=pos[0] && startPos1[1]>pos[1]) {
                    path.setAttribute("stroke", "#2f4193");
                }

                console.log("rA = "+rA+" rB = "+rB);
            }
            path.setAttribute('d',pathString);
            path.setAttribute("fill", "none");
            path.setAttribute('stroke-width', 5);
            path.setAttribute("stroke-dasharray", "5,5");
            var length = path.getTotalLength();
            path.setAttribute("stroke-dashofset", length);


            ws.appendChild(path);*/
        }


        var pathString ="M"+ ((cursorPos[0])) + " " + (cursorPos[1]) +"a"+rA+","+rB +" 0 0,0 "+rA+","+rB;

        path2.setAttribute("stroke", "#ff24f9");
        path2.setAttribute('d',pathString);
        path2.setAttribute("fill", "none");
        path2.setAttribute('stroke-width', 5);
        path2.setAttribute("stroke-dasharray", "5,5");

        if(cursorPos[0]>position[0] && cursorPos[1]>position[1]){
            path2.setAttribute("stroke", "#ff24f9");
            pathString ="M"+ ((cursorPos[0])) + " " + (cursorPos[1]) +"a"+rA+","+rB +" 0 0,1 "+rA+","+rB;
        }else if(cursorPos[0]>position[0] && cursorPos[1]<=position[1]) {
            path2.setAttribute("stroke", "#28932d");

        }else if(cursorPos[0]<=position[0] && cursorPos[1]<=position[1]) {
            path2.setAttribute("stroke", "#ffc816");
            pathString ="M"+ ((cursorPos[0])) + " " + (cursorPos[1]) +"a"+rA+","+rB +" 0 0,1 "+rA+","+rB;
        }else if (cursorPos[0]<=position[0] && cursorPos[1]>position[1]) {
            path2.setAttribute("stroke", "#2f4193");
        }

        //   ws.appendChild(path2);

        console.log("Please select mouse trajectory control");
    }
    else {
        console.error("Please select a valid control");
    }

    ws.appendChild(ee);
    createTarget();
    resetPose();
}

function makeTriangleTarget(num, aX,aY,bX,bY,cX,cY, color) {
    for (var k= 0; k < triangleTargetAngles.length; k++) {
        var newTriangle = document.createElementNS('http://www.w3.org/2000/svg','polygon');

        var idStr=String.fromCharCode(97 + k);
        console.log(triangleTargetAngles[k]+" = "+idStr);
        newTriangle.setAttribute("id", num.toString(2)+idStr);
        newTriangle.setAttribute("stroke-width", 4);
        newTriangle.style.stroke = targetRed;
        newTriangle.style.fill = color;
        newTriangle.setAttribute("points", (aX)+","+(aY)+"," +(bX)+","+(bY)+","+ cX +","+ cY);

        var tarRot =triangleTargetAngles[k];
        newTriangle.setAttribute("transform", "rotate(" + tarRot + " " + aX + " " + cY+ ")");
        ws.appendChild(newTriangle);

    }
}


function createFittsTarget(round) {
    var rect = ws.getBoundingClientRect();

    var height = rect.height;
    var width = rect.width;

    var bound =Math.min(height, width) / 2;
    var lim = bound;
    var targetCircleRadius= [0.0*lim, 0.25*lim, 0.5*lim, 0.75*lim];

    var screenRadius=lim-targetCircleRadius[round];

    console.log("---------");
    console.log(round);
    console.log("---------");

    var circleH=Math.round(width/ 2);
    var circleK=Math.round(height/ 2);


    var circumference = 2 *Math.PI * screenRadius;
    console.log("Circumference of the circle is ", circumference);

    var denominator = 2*numFittsTargets;
    console.log("Denominator is ", denominator);
    var calcRadius=circumference/denominator;
    screenRadius=screenRadius-calcRadius;
    circumference = 2 *Math.PI * screenRadius;
    calcRadius=circumference/denominator;

    var angle=0;
    var bigCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bigCircle.setAttribute("cx", circleH);
    bigCircle.setAttribute("cy", circleK);
    bigCircle.setAttribute("r",screenRadius);
    bigCircle.setAttribute("fill", "#e2e3ee");
    bigCircle.setAttribute("fill-opacity", "0.2");
    bigCircle.setAttribute("stroke","#0f0005");
    bigCircle.setAttribute("id", 'test');
    ws.append(bigCircle);

    for (var i = 0; i <numFittsTargets; i++) {
        var targetCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        angle = (2 * Math.PI / numFittsTargets) * i-Math.PI/ 2 ;
        var tx = circleH +(screenRadius)*Math.cos(angle);
        var ty = circleK +(screenRadius)*Math.sin(angle);

        var newText = document.createElementNS('http://www.w3.org/2000/svg',"text");
        newText.setAttribute("x",tx);
        newText.setAttribute("y",ty);
        newText.setAttribute("font-size","15");

        var textNode = document.createTextNode(i+1);
        newText.appendChild(textNode);
        ws.appendChild(newText);
        targetCircle.setAttribute("cx", tx);
        targetCircle.setAttribute("cy", ty);
        targetCircle.setAttribute("r",calcRadius);
        targetCircle.setAttribute("fill", "#5250ee");
        targetCircle.setAttribute("fill-opacity", "0.2");
        targetCircle.setAttribute("stroke","#0000FF");
        var num =i+1;
        targetCircle.setAttribute("id",  num.toString(2));

        targetCircle.setAttribute("visibility",  "hidden");

        if(i+1==1){
            targetCircle.setAttribute("fill", "#0aee1f");
            targetCircle.setAttribute("visibility",  "visible");
        }
        ws.appendChild(targetCircle);
    }
}

function getTriClickedFitt() {
    var ids = [];
    var letter;
    ids.push(clickedNum);
    ids.push(numFittsTargets/2+clickedNum);
    console.log("getTriClickedFitt ="+clickedNum);
    createCode(clickedNum);
    letter =modNum(clickedNum);
    currTargetCount++;

    if(currTargetCount==triangleTargetAngles.length){
        currTargetCount =0;
    }


    if (clickedNum%2 == 0){
        value=evenCount;
        //  evenCount++;
    }else {
        value=oddCount;

        //    oddCount++;
    }

    if (clickedNum%(triangleTargetAngles.length*2) == 0){
        evenCount++;
        oddCount++;
    }
    //God triangleTargetAngles.length == 3, clickedNum+1
    var sumEv=(numFittsTargets+1)*triangleTargetAngles.length -2*triangleTargetAngles.length+1;
    console.log("sumEv ="+ sumEv);
    if(clickedNum>sumEv){

        if (clickedNum%2 == 0){
            value=1;
            console.log("EVEN last element for the round ="+ value);
            //  evenCount++;
        }else {
            value=prevVal;

            console.log("ODD last element for the round="+ value);
            //    oddCount++;
        }

        var currTri= document.getElementById(value.toString(2)+ letter);

        currTri.style.fill= "#250df2";
        oddCount=1;
        evenCount=Math.ceil(numFittsTargets/2)+1;
        value=1;//Math.round(numFittsTargets/2+clickedNum-1);

    } else{

        var currTri= document.getElementById(value.toString(2)+ letter);
        console.log("tri value ="+value);
        console.log("tri letter ="+letter);
        //   currCircle.setAttribute("visibility",  "visible");
        currTri.style.fill= "#f2559e";
        prevVal=value;
    }

    if (clickedNum>(numFittsTargets+1)*triangleTargetAngles.length) {

        // go to a new round or complete the test
        clearWorkspace();

        clickedNum=1;
        oddCount=1;
        evenCount=Math.ceil(numFittsTargets/2)+1;
        value=1;
        ws.removeEventListener("click", getTriClickedFitt);

        currTriFitts++;
        ws.addEventListener("click", getTriClickedFitt);

        if(currTriFitts<maxTriFitts){
            createFittsTriTarget(currTriFitts);
        }else{
            ws.removeEventListener("click", getTriClickedFitt);
        }

    }else{
        clickedNum++;
    }
}

function getCircleClickedFitt() {
    var ids = [];
    ids.push(clickedNum);
    ids.push(numFittsTargets/2+clickedNum);
    console.log("=======");
    console.log("clickedNum ="+clickedNum);


    console.log("value ="+value);
    if (clickedNum%2 == 0){
        value=evenCount;
        evenCount++;
    }else {
        value=oddCount;
        oddCount++;
    }

    console.log("value ="+value);

    if(clickedNum==numFittsTargets+1){
        console.log("last element for the round");
        value = 1;
        var currCircle = document.getElementById(value.toString(2));

        currCircle.style.fill= "#250df2";
        oddCount=1;
        evenCount=Math.ceil(numFittsTargets/2)+1;
        value=1;//Math.round(numFittsTargets/2+clickedNum-1);

    } else{

        var currCircle = document.getElementById(value.toString(2));
        currCircle.setAttribute("visibility",  "visible");
        currCircle.style.fill= "#f20def";
    }
    clickedNum++;
    if (clickedNum>numFittsTargets+2) {
        // go to a new round or complete the test
        clearWorkspace();
        clickedNum=1;
        oddCount=1;
        evenCount=Math.ceil(numFittsTargets/2)+1;
        value=1;//Math.round(numFittsTargets/2+clickedNum-1);

        ws.removeEventListener("click", getCircleClickedFitt);

        currRoundFitts++;
        ws.addEventListener("click", getCircleClickedFitt);

        if(currRoundFitts<maxRoundFitts){
            createFittsTarget(currRoundFitts);
        }else{
            ws.removeEventListener("click", getCircleClickedFitt);
        }
    }
}

function createCode(clickedNum) {
    var letterVal;
    var letter='a';
    codeSTR= "var letter;" + "\n"+"if (" + clickedNum + "%" +triangleTargetAngles.length*2+" == 0||" +clickedNum+
        "%" +triangleTargetAngles.length*2+"==1){" + "\n"+ "letter ='a';"+ "\n"+"}";
    var j=1;
    for (var i = 2; i < triangleTargetAngles.length*2; i+=2) {
        letterVal =String.fromCharCode(97 + j );
        letter =letterVal;
        codeSTR+="else if (" + clickedNum + "%" +triangleTargetAngles.length*2+" == " +i + "||"
            +clickedNum+ "%" +triangleTargetAngles.length*2+ "==" +(i+1)+"){"
            + "\n"+ "letter ='" +letterVal+ "';"+ "\n"+"}";
        j++;
    }
    return;
}
var modNum= new Function('clickedNum',
    "eval(codeSTR);" +

    "console.log(letter);"+
    'return letter;'
);

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createFittsTriTarget(round) {
    var rect = ws.getBoundingClientRect();

    var height = rect.height;
    var width = rect.width;

    // get maximum radius for big circle
    var bound = Math.min(rect.height, rect.width)/2;
    var lim = bound;

    var targetCircleRadius= [0.0*lim, 0.25*lim, 0.5*lim, 0.75*lim];

    var screenRadius=lim-targetCircleRadius[round];

    console.log("---------");
    console.log("triangle");
    console.log("---------");

    var circleH=Math.round(rect.width/ 2);
    var circleK=Math.round(rect.height/ 2);

    var circumference = 2 *Math.PI * screenRadius;
    console.log("Circumference of the circle is ", circumference);

    var denominator =2*numFittsTargets;
    console.log("Denominator is ", denominator);
    var calcRadius=circumference/denominator;
    screenRadius=screenRadius-calcRadius;
    circumference = 2 *Math.PI * screenRadius;
    calcRadius=circumference/denominator;

    var angle=0;

    var bigCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bigCircle.setAttribute("cx", circleH);
    bigCircle.setAttribute("cy", circleK);
    bigCircle.setAttribute("r",screenRadius);
    bigCircle.setAttribute("fill", "#e2e3ee");
    bigCircle.setAttribute("fill-opacity", "0.2");
    bigCircle.setAttribute("stroke","#0f0005");
    bigCircle.setAttribute("id", 'test');
    ws.append(bigCircle);
    var targetCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    for (var i = 0; i <numFittsTargets; i++) {

        var targetCircleNew=targetCircle.cloneNode(true);
        angle = (2 * Math.PI / numFittsTargets) * i-Math.PI/ 2 ;
        var tx = circleH +(screenRadius)*Math.cos(angle);
        var ty = circleK +(screenRadius)*Math.sin(angle);

        var h=tx;
        var k=ty;
        var r=calcRadius;//base

        var aX=h;
        var aY=k+calcRadius;    //height

        // tip of triangle
        var bX=r+h;
        var bY=k;

        var cX=h-r;
        var cY=k;
        var num =i+1;

        // triangle targets with different angles
        makeTriangleTarget(num,aX,aY,bX,bY,cX,cY,getRandomColor());

        var newText = document.createElementNS('http://www.w3.org/2000/svg',"text");
        newText.setAttribute("x",tx);
        newText.setAttribute("y",ty);
        newText.setAttribute("font-size","15");

        var textNode = document.createTextNode(i+1);
        newText.appendChild(textNode);
        ws.appendChild(newText);
        targetCircleNew.setAttribute("cx", tx);
        targetCircleNew.setAttribute("cy", ty);
        targetCircleNew.setAttribute("r",calcRadius);
        targetCircleNew.setAttribute("fill", "#1e62ee");
        targetCircleNew.setAttribute("fill-opacity", "0.2");
        targetCircleNew.setAttribute("stroke","#0035ff");
        targetCircleNew.setAttribute("id",  num.toString(2));

        //   targetCircle.setAttribute("visibility",  "hidden");

        if(i+1==1){
            targetCircleNew.setAttribute("fill", "#0aee1f");
            targetCircleNew.setAttribute("visibility",  "visible");
        }
        ws.appendChild(targetCircleNew);
    }
}



function createTrajectoryArrows() {
    var ws = document.getElementById("workspace");
    trajArrows = [];
    trajNums = [];
    for(var i = 0; i < numTrajArrows; i++){
        var angle = ((2 * Math.PI) / numTrajArrows) * i;
        var unitX = Math.cos(angle);
        var unitY = Math.sin(angle);
        var x = unitX * trajArrowLength;
        var y = unitY * trajArrowLength;

        var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        arrow.setAttribute('x1', 0);
        arrow.setAttribute('y1', 0);
        arrow.setAttribute('x2', x);
        arrow.setAttribute('y2', y);
        arrow.setAttribute('stroke', "red");
        arrow.setAttribute('stroke-width', lineThickness);
        arrow.setAttribute('id', (i + 1));
        arrow.setAttribute('value', String(unitX + "," + unitY));
        moveObject(arrow, pos[0], pos[1], rot);
        trajArrows.push(arrow);
        ws.appendChild(arrow);

        var num = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        num.setAttribute('x', x * 1.2);
        num.setAttribute('y', y * 1.2);
        num.style.fontSize = trajFontSize + "px";
        num.innerHTML = i;
        trajNums.push(num);
        ws.appendChild(num);
    }
}

function createGhost(){
    var ws = document.getElementById("workspace");
    ghost = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ghost.setAttribute('x1', 0);
    ghost.setAttribute('y1', 0);
    ghost.setAttribute('x2', 0);
    ghost.setAttribute('y2', 0);
    ghost.setAttribute('stroke', "red");
    ghost.setAttribute('stroke-width', lineThickness);
    ws.appendChild(ghost);
}

function createTarget() {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    var edgeBuffer = innerR + ringWidth +(arrowLengthTot * scale);
    targetPos = [edgeBuffer + Math.random()*(rect.width - 2 * edgeBuffer),
        edgeBuffer + Math.random()*(rect.height - 2 * edgeBuffer)];
    targetRot = Math.random()*360 - 180;
    target = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    target.setAttribute("id", "target");
    target.setAttribute("stroke-width", 4);
    target.style.fill = "none";
    target.style.stroke = targetRed;
    target.setAttribute("points", (-triWidth/2)+","+(-triHeightDiff)+","+(triWidth/2)+","+(-triHeightDiff)+","+ 0 +","+ (innerR - pointOffset));
    moveObject(target, targetPos[0], targetPos[1], targetRot);
    //Initialize end-effector
    ws.appendChild(target);
}

function createRing() {
    var ws = document.getElementById("workspace");
    var rect = ws.getBoundingClientRect();
    ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("id", "ring");
    // ring.setAttribute("cx", Math.round(rect.width/2));
    // ring.setAttribute("cy", Math.round(rect.height/2));
    ring.setAttribute("r", innerR + ringWidth/2);
    ring.setAttribute("stroke-width", ringWidth);
    ring.style.fill = "none";
    ring.style.stroke = "#AAC";
    ring.setAttribute("class", "draggable");
    ring.setAttribute("stroke-dasharray", "30, 0.3");
    if (isOneTouch)
        ring.setAttributeNS(null, "onclick", "startRotate(evt)");
    else
        ring.setAttributeNS(null, "onmousedown", "startRotate(evt)");
    ws.appendChild(ring);
}

function createArrows() {
    var ws = document.getElementById("workspace");

    arrowRight = document.createElementNS('http://www.w3.org/2000/svg','path');
    arrowLeft = document.createElementNS('http://www.w3.org/2000/svg','path');
    arrowUp = document.createElementNS('http://www.w3.org/2000/svg','path');
    arrowDown = document.createElementNS('http://www.w3.org/2000/svg','path');

    arrows = [arrowRight, arrowLeft, arrowUp, arrowDown];

    arrows.forEach(function(arrow) {
        arrow.setAttribute("d", "M0,"+(0)+" h"+arrowShaftLength+"v"+(-lipHeight)+"l"+arrowheadLength+","+(lipHeight +
            (arrowWidth /2)) +"l"+ (-arrowheadLength)+","+
            (lipHeight + (arrowWidth /2)) +"v"+(-lipHeight)+"h"+(-arrowShaftLength)+"z");
    });

    arrowRight.style.fill = "#181acc";
    arrowLeft.style.fill = "#181acc";
    arrowUp.style.fill = "#cc070e";
    arrowDown.style.fill = "#cc070e";

    arrows.forEach(function(arrow) {
        ws.appendChild(arrow);
    });

    arrowRightXOffset = innerR + ringWidth;
    arrowRightYOffset = - arrowWidth / 2;
    arrowLeftXOffset = - (innerR + ringWidth);
    arrowLeftYOffset =  arrowWidth / 2;
    arrowUpXOffset = - arrowWidth / 2;
    arrowUpYOffset =  - (innerR + ringWidth);
    arrowDownXOffset = arrowWidth / 2;
    arrowDownYOffset = (innerR + ringWidth);

    // The transform attribute gets set in resetPose()
}


function startGhost(evt) {
    var ws = document.getElementById("workspace");
    targetFixedX = evt.offsetX;
    targetFixedY = evt.offsetY;
    ws.setAttribute("onmousemove", "drawGhost(evt)");
    if (isOneTouch) {
        ws.setAttribute("onclick", "targetMoveEE(evt)");
    }
    else {
        ws.setAttribute("onmouseup", "targetMoveEE(evt)");
    }
}


function drawGhost(evt) {
    ghost.setAttribute('x1', targetFixedX);
    ghost.setAttribute('y1', targetFixedY);
    ghost.setAttribute('x2', evt.offsetX);
    ghost.setAttribute('y2', evt.offsetY);

    var deltaX = evt.offsetX - targetFixedX;
    var deltaY = evt.offsetY - targetFixedY;
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    angle -= 90;
    if (angle > 180)
        angle -= 360;
    if (angle < -180)
        angle += 360;

    if(checkGoal(targetFixedX, targetFixedY, targetPos[0], targetPos[1], angle, targetRot)){
        target.setAttribute("stroke-dasharray", "10, 5");
        target.style.stroke = targetGreen;
    }
    else {
        target.removeAttribute("stroke-dasharray");
        target.style.stroke = targetRed;
    }
}

function targetMoveEE(evt) {
    var ws = document.getElementById("workspace");
    console.log("moving");
    ws.removeAttribute("onmousemove");
    target.removeAttribute("stroke-dasharray");
    pos = [targetFixedX, targetFixedY];
    var deltaX = evt.offsetX - targetFixedX;
    var deltaY = evt.offsetY - targetFixedY;
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    angle -= 90;
    rot = angle;
    if (rot > 180)
        rot -= 360;
    if (rot < -180)
        rot += 360;

    resetPose();
    if(checkGoal(pos[0], pos[1], targetPos[0], targetPos[1], rot, targetRot)){
        success();
    }


    if (isOneTouch)
        ws.setAttribute("onclick", "startGhost(evt)");

}

function resetPose() {
    var x = 0;
    var y = 0;
    ee.setAttribute("points", (x-triWidth/2)+","+(y-triHeightDiff)+","+(x+triWidth/2)+","+(y-triHeightDiff)+","+(x)+","+
        (y+innerR - pointOffset));
    moveObject(ee, pos[0], pos[1], rot);
    if(ring) {
        moveObject(ring, pos[0], pos[1], rot);
    }

    if(arrows){
        moveObjectAndScale(arrowRight, pos[0] + arrowRightXOffset, pos[1] + arrowRightYOffset, 0, scale);
        moveObjectAndScale(arrowLeft, pos[0] + arrowLeftXOffset, pos[1] + arrowLeftYOffset, 180, scale);
        moveObjectAndScale(arrowUp, pos[0] + arrowUpXOffset, pos[1] + arrowUpYOffset, -90, scale);
        moveObjectAndScale(arrowDown, pos[0] + arrowDownXOffset, pos[1] + arrowDownYOffset, 90, scale);
    }

    if(trajArrows){
        trajArrows.forEach(function (arrow) {
            moveObject(arrow, pos[0], pos[1], 0);

        });
    }

    if(trajNums){
        trajNums.forEach(function (num) {
            moveObject(num, pos[0], pos[1], 0);
        });
    }

    if(checkGoal(pos[0], pos[1], targetPos[0], targetPos[1], rot, targetRot)){
        target.style.stroke = targetGreen;
    }
    else{
        target.style.stroke = targetRed;
    }

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
        ws.setAttribute("onclick","stopRotate(evt)");
        evt.stopPropagation();
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

// Check if target is reached
function checkGoal(currPoseX, currPoseY, goalPoseX, goalPoseY, currRot, goalRot){
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

        if(checkGoal(pos[0], pos[1], targetPos[0], targetPos[1], rot, targetRot)){
            success(); }
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
        if(checkGoal(pos[0], pos[1], targetPos[0], targetPos[1], rot, targetRot)){
            success();
        }
    }
}

function continuousMove(x, y) {

}

function clearWorkspace() {
    var ws = document.getElementById("workspace");
    while(ws.hasChildNodes()){
        ws.removeChild(ws.firstChild);
    }

    ws.removeEventListener("click", getTriClickedFitt);
    ws.removeEventListener("click", getCircleClickedFitt);
    ws.removeAttribute("onmousemove");
    ws.removeAttribute("onclick");
    ws.removeAttribute("onmousedown");
    ws.removeAttribute("onmouseup");
}

function moveObject(object, x, y, theta) {
    object.setAttribute("transform", "translate(" + x + " " + y + ") rotate(" + theta + " " + 0 + " " + 0 + ")");
    // This is where you can log the object, and how it is moving
}

function moveObjectAndScale(object, x, y, theta, scale) {
    object.setAttribute("transform", "translate(" + x + " " + y + ") rotate(" + theta + " " + 0 + " " + 0 + ") scale(" + scale + ")" );
    // This is where you can log the object, and how it is moving
}


function success() {
    target.style.stroke = targetGreen;
    score++;
    clearWorkspace();
    createEE();
    console.log("SUCCESS!");
}
