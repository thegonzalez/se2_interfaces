/**
 * index.js
 * Higher level stuff
 */

function loadInterface() {
    createEE();
}

function guiUpdate() {
    clearWorkspace();
    control = document.getElementById("guiSelect").selectedIndex;
    createEE(); /* Please create the following code */
}
