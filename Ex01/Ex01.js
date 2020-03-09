let gl;

window.onload = function init() {

	// Gets 3D Canvas context
	let canvas = document.getElementById('gl-canvas');

	// JavaScript utilities for common WebGL tasks (checks for success or failure)
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL not available"); }

	// Sets WebGL viewport (same size as Canvas element)
	gl.viewport(0, 0, canvas.width, canvas.height);
	// Sets background color
	gl.clearColor(0.9, 0.9, 0.8, 1.0);

	// Compiles both vertex and fragment shaders in GPU 
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Uploads data into GPU
	let bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

	// Links shader variables to data buffers
	let vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Object rendering
	let vertices = [];

	document.querySelector("#form").addEventListener("submit", e => {
		let N = document.querySelector("#vertexNumber").value;
		let xCenter = document.querySelector("#xCenter").value;
		let yCenter = document.querySelector("#yCenter").value;
		let radius = document.querySelector("#radius").value;
		let angle = 0;
		for (let i = 0; i < N; i++) {
			angle += Math.PI * 2 / N;
			let x = xCenter + radius * Math.cos(angle);
			let y = yCenter + radius * Math.sin(angle);
			vertices.push(x);
			vertices.push(y);
		}
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, N);

		e.preventDefault();
	})

	render();
};

// Draw the scene
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
}