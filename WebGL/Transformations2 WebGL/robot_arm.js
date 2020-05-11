/*
 * robot_arm.js
 * This program shows how to composite modeling transformations
 * to draw translated and rotated hierarchical models.
 *
 * Adapted for OpenGL 3.2 Core Profile by Alex Clarke, 2012, with
 * libraries provided with Interactive Computer Graphics 6th Ed. 
 * by Dr. Edward Angel and Dave Shreiner
 *
 * Adapted from the above for WebGL by Alex Clarke, 2016, with
 * libraries provided with Interactive Computer Graphics 7th Ed.
 * by Dr. Edward Angel and Dave Shreiner
 */


//----------------------------------------------------------------------------
// Variable Setup 
//----------------------------------------------------------------------------

// This variable will store the WebGL rendering context
let gl;

//Define points for
const cubeVerts = [
    [0.5, 0.5, 0.5, 1], //0
    [0.5, 0.5, -0.5, 1], //1
    [0.5, -0.5, 0.5, 1], //2
    [0.5, -0.5, -0.5, 1], //3
    [-0.5, 0.5, 0.5, 1], //4
    [-0.5, 0.5, -0.5, 1], //5
    [-0.5, -0.5, 0.5, 1], //6
    [-0.5, -0.5, -0.5, 1], //7
];

//Look up patterns from cubeVerts for different primitive types
const cubeLookups = [
    //Solid Cube - use TRIANGLES, starts at 0, 36 vertices
    0, 4, 6, //front
    0, 6, 2,
    1, 0, 2, //right
    1, 2, 3,
    5, 1, 3, //back
    5, 3, 7,
    4, 5, 7, //left
    4, 7, 6,
    4, 0, 1, //top
    4, 1, 5,
    6, 7, 3, //bottom
    6, 3, 2,
]; //(6 faces)(2 triangles/face)(3 vertices/triangle)

//load points into points array - runs once as page loads.
const points = [];
for (var i = 0; i < cubeLookups.length; i++) {
    points.push(cubeVerts[cubeLookups[i]]);
}

const red = [1.0, 0.0, 0.0, 1.0];
const green = [0.0, 1.0, 0.0, 1.0];
const blue = [0.0, 0.0, 1.0, 1.0];
const lightred = [1.0, 0.5, 0.5, 1.0];
const lightgreen = [0.5, 1.0, 0.5, 1.0];
const lightblue = [0.5, 0.5, 1.0, 1.0];
const white = [1.0, 1.0, 1.0, 1.0];

//Set up colors array
const colors = [
    //Colors for Solid Cube
    lightblue, lightblue, lightblue, lightblue, lightblue, lightblue,
    lightgreen, lightgreen, lightgreen, lightgreen, lightgreen, lightgreen,
    lightred, lightred, lightred, lightred, lightred, lightred,
    blue, blue, blue, blue, blue, blue,
    red, red, red, red, red, red,
    green, green, green, green, green, green,
];

//Variables for Transformation Matrices
let mv = new mat4();
let p = new mat4();
let mvLoc, projLoc;


//----------------------------------------------------------------------------
// Initialization Event Function
//----------------------------------------------------------------------------
window.onload = function init() {
    // Set up a WebGL Rendering Context in an HTML5 Canvas
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    //  eg. - set a clear color
    //      - turn on depth testing
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Set up data to draw
    // Load the data into GPU data buffers and
    // Associate shader attributes with corresponding data buffers
    //***Vertices***
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    program.vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(program.vPosition, 4, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(program.vPosition);

    //***Colors***
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    program.vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(program.vColor, 4, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(program.vColor);

    // Get addresses of shader uniforms
    projLoc = gl.getUniformLocation(program, "projection"); //projection
    mvLoc = gl.getUniformLocation(program, "modelview"); //modelview

    //Set up view transformation (and store in modelview variable)
    const eye = vec3(0.0, 0.0, 10.0); //position of the camera specified in world coordinates
    const at = vec3(0.0, 0.0, 0.0); //indicates the target of the camera (where we want to look)
    const up = vec3(0.0, 1.0, 0.0); //defines which direction is up
    mv = lookAt(eye, at, up);

    //Animate - draw continuously
    render();
};



//---------------------------------------------------------
// Animation 
//---------------------------------------------------------

//SHOULDER state variables
let shoulderXrot = 0;
let shoulderZrot = 0;
let armXrot = 0;
let armZrot = 0;
let wireframeType = 1;
let buttonPress = false; // Boolean Variable that helps with the e key event

function render() {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    // c) 
    let type = gl.LINE_LOOP;

    wireframeType == 1 ? type = gl.LINE_LOOP : type = gl.TRIANGLES;
    // END c) 

    //Set up projection transformation
    const ratio = gl.viewportWidth / gl.viewportHeight;
    const pAngle = parseInt(document.getElementById("pAngle").value);
    const zNear = parseFloat(document.getElementById("zNear").value);
    const zFar = parseFloat(document.getElementById("zFar").value);

    console.log("pAngle: " + pAngle + " zNear: " + zNear + " zFar: " + zFar);

    p = perspective(pAngle, ratio, zNear, zFar);
    gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));


    //STACK to store modelview transformations
    let matStack = [];

    //Save VIEW transform
    matStack.push(mv); //mv with initial state (see line 150)

    /* FIRST ARM */

    // a) mv = mult(mv, translate(0, 0.0, 0.0));

    mv = mult(mv, translate(-1.0, 0.0, 0.0));

    mv = mult(mv, rotate(shoulderXrot, [1, 0, 0]));
    mv = mult(mv, rotate(shoulderZrot, [0, 0, 1]));

    mv = mult(mv, scalem(2.0, 0.5, 1.0));

    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));

    gl.drawArrays(type, 0, 36);

    mv = matStack.pop();

    /* END FIRST ARM */

    /* SECOND ARM */

    matStack.push(mv);
    // a) mv = mult(mv, translate(0, 0.0, 0.0));

    buttonPress == false ? mv = mult(mv, translate(-1, 0.0, 0.0)) : buttonPress

    mv = mult(mv, rotate(armXrot, [1, 0, 0]));
    mv = mult(mv, rotate(armZrot, [0, 0, 1]));

    buttonPress == false ? mv = mult(mv, translate(2.0, 0.0, 0.0)) :
        mv = mult(mv, translate(1, 0.0, 0.0));

    mv = mult(mv, scalem(2.0, 0.5, 1.0));

    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));

    gl.drawArrays(type, 0, 36);

    mv = matStack.pop();

    /* END SECOND ARM */

    requestAnimationFrame(render);
}



//----------------------------------------------------------------------------
// Keyboard Event Functions
//----------------------------------------------------------------------------
document.onkeydown = function handleKeyDown(e) {
    const key = e.key;

    /* KEY EVENTS */

    //key R - X-axis rotation
    if (key == "r") {
        shoulderXrot++;
        armXrot++;
    }
    if (key == "R") {
        shoulderXrot--;
        armXrot--;
    }
    //key S - Z-axis rotation
    if (key == "s") {
        if (shoulderZrot < 90) {
            shoulderZrot++;
            armZrot++;
        } else {
            shoulderZrot = 90;
            armZrot = 90;
        }
    }
    if (key == "S") {
        if (shoulderZrot > -90) {
            shoulderZrot--;
            armZrot--;
        } else {
            shoulderZrot = -90;
            armZrot = -90;
        }
    }
    // c) 
    if (key == "t") {
        wireframeType == 1 ? wireframeType = 2 : wireframeType = 1
    }
    // END c) 
    // d)
    if (key == "e" && armZrot <= 145) {
        armZrot++;
        buttonPress = true
    }
    if (key == "E" && armZrot >= -145) {
        armZrot--;
        buttonPress = true
    }
}

// END d) 