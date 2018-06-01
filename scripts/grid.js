/**
 * Created by timadamson on 5/17/18.
 */

var colors = ["#e6194b", "#3cb44b", "#ffe119", "#0082c8", "#f58231", "#911eb4", "#aa6e28", "#fabebe", "#008080"];

function addGrid(lowerX, lowerY, upperX, upperY, sideLength){
    var ws = document.getElementById("workspace");
    var box = ws.getBoundingClientRect();
    $('rect').remove();
    $('text').remove();

    if(upperX - lowerX < (threshold * 3)){
        var midX = (upperX - lowerX) / 2 + lowerX;
        var midY = (upperY - lowerY) / 2 + lowerY;

        pos = [midX, midY];
        resetPose();
        addPie(0, 360, 4);
    }
    else {

        var width = (upperX - lowerX) / sideLength;
        var height = (upperY - lowerY) / sideLength;
        var textSize = width / 5;

        var count = 1;
        for (var j = 0; j < sideLength; j++) {
            for (var i = 0; i < sideLength; i++) {
                var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                var x = lowerX + (((upperX - lowerX) / sideLength) * (i % sideLength));
                var y = lowerY + (((upperY - lowerY) / sideLength) * (j % sideLength));
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', String(width));
                rect.setAttribute('height', String(height));
                rect.setAttribute('id', String(count));
                rect.setAttribute("onclick", "addGrid(" + x + "," + y + "," + (x + width) + "," + (y + height) + "," +
                    sideLength + ")");
                rect.setAttribute('fill', colors[count - 1]);
                ws.appendChild(rect);

                var gridNum = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                gridNum.setAttribute('x', x + (width/2));
                gridNum.setAttribute('y', y + (height/2));
                gridNum.style.fontSize = textSize + "px";
                gridNum.innerHTML = count;
                ws.appendChild(gridNum);

                count++;
            }
        }

        if (target) {
            ws.appendChild(target);
        }

        if (ee) {
            ws.appendChild(ee);
        }

    }
}

function addPie(begSlice, endSlice, numSlices) {
    var ws = document.getElementById("workspace");
    var box = ws.getBoundingClientRect();

    if(begSlice < 0 || endSlice > 360){
        console.error("The slice range is not in bounds");
        return;
    }

    $(".slice").remove();

    if(endSlice - begSlice < threshold * 2){
        rot = (endSlice + begSlice) / 2;
        rot = 270 - rot;
        if (rot > 180)
            rot -= 360;
        if (rot < -180)
            rot += 360;
        console.log("rot: " + rot);
        resetPose();
        addGrid(0, 0, box.width, box.height, gridSideLength);
        // addPie(0, 360, 4);
    }
    else {
        var radius = 50;
        var sliceWidth = (endSlice - begSlice) / numSlices;
        var sliceWidthRad = sliceWidth * (Math.PI / 180);

        for (var i = 0; i < numSlices; i++) {
            var slice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            var d = 'M 0,0 ' + radius + ",0" + " A" + radius + "," + radius + " 0 0,0 " +
                radius * Math.cos(sliceWidthRad) + "," + String(-radius * Math.sin(sliceWidthRad)) + " z";
            console.log(d);
            slice.setAttribute('d', d);
            slice.setAttribute('fill', colors[i]);
            slice.setAttribute('class', 'slice');
            slice.setAttribute('id', (i + 1));
            var begThisSlice = (i * sliceWidth) + begSlice;
            var endThisSlice = begThisSlice + sliceWidth;
            moveObject(slice, pos[0], pos[1], -begThisSlice);
            slice.setAttribute('onclick', 'addPie(' + begThisSlice + ',' + endThisSlice + ',' + numSlices + ')');
            ws.appendChild(slice);

        }
        if (target) {
            ws.appendChild(target);
        }

        if (ee) {
            ws.appendChild(ee);
        }
    }


}