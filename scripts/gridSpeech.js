/**
 * Created by timadamson on 5/11/18.
 */
    function createGridSpeech() {
        if (annyang) {
            // Let's define our first command. First the text we expect, and then the function it should call
            var recentTimeout;
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




            var commands = {
                'one': one,

                'two': two,

                'three': three,

                'four': four,

                'five': five,

                'six': six,

                'seven': seven,

                'eight': eight,

                'nine': nine
            };

            function selectNum(num) {
                $("#" + num).trigger("click");
            }


            // Add our commands to annyang
            annyang.addCommands(commands);


            // Start listening. You can call this here, or attach this call to an event, button, etc.
            annyang.start({autoRestart: true, continuous: false});


        }
    }
