let gl;
let vertices
let Nvertex
let xCenter, yCenter
let radius
let count = 0
let program, program1

window.onload = function init() {
	// Gets 3D Canvas context
	let canvas = document.getElementById('gl-canvas');

	// JavaScript utilities for common WebGL tasks (checks for success or failure)
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL not available");
	}

	// Sets WebGL viewport (same size as Canvas element)
	gl.viewport(0, 0, canvas.width, canvas.height);
	// Sets background color
	gl.clearColor(0.9, 0.9, 0.8, 1.0);

	// Compiles both vertex and fragment shaders in GPU
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	program1 = initShaders(gl, "vertex-shader", "fragment-shader1");

	// Uploads data into GPU
	let bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

	// Links shader variables to data buffers
	window.addEventListener('keydown', handleKeyDown)
	let vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);


	// Object rendering
	render();
};

function poligon() {
	Nvertex = parseFloat(document.getElementById("Nvertex").value)
	xCenter = parseFloat(document.getElementById("x").value)
	yCenter = parseFloat(document.getElementById("y").value)
	radius = parseFloat(document.getElementById("radius").value)

	let alpha = 2 * Math.PI / Nvertex
	vertices = []

	for (let i = 0; i < Nvertex; i++) {
		let x = xCenter + radius * Math.cos(alpha * i)
		let y = yCenter + radius * Math.sin(alpha * i)

		vertices.push(x);
		vertices.push(y);
	}

	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	render();
}

// Draw the scene
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	if (count % 2 == 0) {
		gl.useProgram(program)
	} else {
		gl.useProgram(program1)
	}

	// Draw data as triangle primitives
	gl.drawArrays(gl.LINE_LOOP, 0, Nvertex);
}

function handleKeyDown(e) {
	switch (e.key) {
		case "w":
			count++;
			render();
			break;
	}
}