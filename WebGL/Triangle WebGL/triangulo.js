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

	// Geometric data 
	const vertices = new Float32Array([
		-0.5, -0.5,	
		0, 0.5, 
		0.5, -0.5	
	]);

	// Uploads data into GPU
	let bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// Links shader variables to data buffers
	let vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Object rendering
	render();
};

// Draw the scene
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	// Draw data as triangle primitives
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}