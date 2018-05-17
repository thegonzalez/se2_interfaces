/**
 * Created by timadamson on 5/17/18.
 */

var colors = ["#e6194b", "#3cb44b", "#ffe119", "#0082c8", "#f58231", "#911eb4", "#aa6e28", "#fabebe", "#008080"];

function addGrid(lowerX, lowerY, upperX, upperY, sideLength){
    var ws = document.getElementById("workspace");
    var box = ws.getBoundingClientRect();
    $('rect').remove();

    if(upperX - lowerX < (threshold * 3)){
        var midX = (upperX - lowerX) / 2 + lowerX;
        var midY = (upperY - lowerY) / 2 + lowerY;

        pos = [midX, midY];
        resetPose();
        addGrid(0, 0, box.width, box.height, gridSideLength);
    }
    else {

        var width = (upperX - lowerX) / sideLength;
        var height = (upperY - lowerY) / sideLength;
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