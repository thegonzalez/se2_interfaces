/**
 * Created by timadamson on 5/22/18.
 */

function createTrajSpeech() {
    if (annyang) {
        // Let's define our first command. First the text we expect, and then the function it should call
        var recentTimeout;
        var timoutInterval = 100;

        var ws = document.getElementById("workspace");
        var rect = ws.getBoundingClientRect();

        var one = function () {
            selectNum(1);
        };

        var two = function () {
            selectNum(2);
        };

        var three = function () {
            selectNum(3);
        };

        var four = function () {
            selectNum(4);
        };

        var five = function () {
            selectNum(5);
        };

        var six = function () {
            selectNum(6);
        };

        var seven = function () {
            selectNum(7);
        };

        var eight = function () {
            selectNum(8);
        };

        var nine = function () {
            selectNum(9);
        };

        var stop = function () {
            console.log("stop");
            clearTimeout(recentTimeout);
        };

        var commands = {
            'one': one,

            'two': two,

            'three': three,

            'four': four,

            'five': five,

            'six': six,

            'seven': seven,

            'eight': eight,

            'nine': nine,

            'stop':stop
        };

        function selectNum(num) {
            var coordinates = $("#" + num)[0].getAttribute('value');
            coordinates = coordinates.split(",");
            continuousMove(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
            console.log(coordinates);
        }

        function continuousMove(x, y) {
            clearTimeout(recentTimeout);
            console.log("moving");
            if (pos[1] < rect.height && pos[1] > 0 && pos[0] < rect.width && pos[0] > 0) {
                pos[0] = pos[0] + x;
                pos[1] = pos[1] + y;
                resetPose();
            }
            recentTimeout = setTimeout(function () {
                continuousMove(x,y)
            }, timoutInterval);
        }



        // Add our commands to annyang
        annyang.addCommands(commands);


        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start({autoRestart: true, continuous: false});


    }
}
