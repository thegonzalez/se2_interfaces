/**
 * Created by timadamson on 4/18/18.
 */
function createCardinalSpeech() {
    if (annyang) {
        // Let's define our first command. First the text we expect, and then the function it should call
        var recentTimeout;
        var startTime;
        var moveDistance = 1;
        var turnAngle = 10;
        var timoutInterval = 100;
        var ws = document.getElementById("workspace");
        var rect = ws.getBoundingClientRect();

        // This is just a slider. Has nothing to do with annyang
        var slider = document.getElementById("myRange");
        slider.oninput = function () {
            moveDistance = parseInt(this.value) / 10;
        };


        var up = function () {
            clearTimeout(recentTimeout);
            console.log("up");
            if (pos[1] > 0) {
                pos[1] = pos[1] - moveDistance;
                resetPose();
            }
            recentTimeout = setTimeout(function () {
                up()
            }, timoutInterval);
        };

        var down = function () {
            clearTimeout(recentTimeout);
            console.log("down");
            if (pos[1] < rect.height) {
                pos[1] = pos[1] + moveDistance;
                resetPose();
            }
            recentTimeout = setTimeout(function () {
                down()
            }, timoutInterval);
        };

        var left = function () {
            clearTimeout(recentTimeout);
            console.log("left");
            if (pos[0] > 0) {
                pos[0] = pos[0] - moveDistance;
                resetPose();
            }
            recentTimeout = setTimeout(function () {
                left()
            }, timoutInterval);
        };

        var right = function (evt) {
            clearTimeout(recentTimeout);
            console.log("right");
            if (pos[0] < rect.width) {
                pos[0] = pos[0] + moveDistance;
                resetPose();
            }
            recentTimeout = setTimeout(function () {
                right()
            }, timoutInterval);
        };

        var clockwise = function () {
            clearTimeout(recentTimeout);
            console.log("clockwise");
            rot += turnAngle;
            if (rot > 180) {
                rot -= 360;
            }
            resetPose();

            recentTimeout = setTimeout(function () {
                clockwise()
            }, timoutInterval);
        };

        var counterclockwise = function () {
            clearTimeout(recentTimeout);
            console.log("counterclockwise");
            rot -= turnAngle;
            if (rot < -180)
                rot += 360;
            resetPose();

            recentTimeout = setTimeout(function () {
                counterclockwise()
            }, timoutInterval);
        };

        var stop = function () {
            console.log("stop");
            clearTimeout(recentTimeout);
        };

        var commands = {
            'up': up,

            'down': down,

            'left': left,

            'right': right,

            'clockwise': clockwise,

            'counterclockwise': counterclockwise,

            'stop': stop
        };


        // Add our commands to annyang
        annyang.addCommands(commands);

        annyang.addCallback('soundstart', function () {
            startTime = performance.now();
        });

        annyang.addCallback('result', function () {
            console.log(performance.now() - startTime);
        });

        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start({autoRestart: true, continuous: false});


    }
}
