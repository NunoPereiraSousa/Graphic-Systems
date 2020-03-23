//GLOBALS
let gl;
let program;
let wireframe = false;

let nPoly = 0; //total number of polygons to draw
let numPontos = []; //array with the number of vertices (per polygon)
let vertices = []; //array withh all the vertices (per polygon)

window.onload = function init() {
	// Gets 3D Canvas context
	const canvas = document.getElementById('gl-canvas');

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
	gl.useProgram(program);

	// Creates buffer for geometric data
	let bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId); //binds it later

	// Links shader variables to data buffers
	let vPosition = gl.getAttribLocation(program, "vPosition"); //gets attribute shader variable
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	window.addEventListener('keydown', handleKeyDown);

	desenhaPoligonos();
};


function poligono(numPontos, xCentro, yCentro, raio) {
	const alpha = 2 * Math.PI / numPontos;
	let ang = 0;
	let pontos = [];

	for (i = 0; i < numPontos; i++) {
		let x = xCentro + raio * Math.cos(ang);
		let y = yCentro + raio * Math.sin(ang);
		pontos.push(x);
		pontos.push(y);
		ang += alpha;
	}
	return pontos;
}

function desenhaPoligonos() {
	let raio = parseFloat(document.getElementById('raio').value);
	numPontos[nPoly] = parseInt(document.getElementById('n').value);
	var xCentro = parseFloat(document.getElementById('xCentro').value);
	var yCentro = parseFloat(document.getElementById('yCentro').value);

	//add the new vertices
	vertices = vertices.concat(poligono(numPontos[nPoly++], xCentro, yCentro, raio));

	// uploads geometric data into GPU
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	render();
}

function handleKeyDown(e) {
	switch (String.fromCharCode(e.keyCode)) {
		case "w":
		case "W":
			wireframe = !wireframe; //volta a desenhar a cena
			render();
			break;
	}
	console.log("Tecla Pressionada: " + e.keyCode + " wireframe=" + wireframe);
}

function render() {
	//resets the color buffer, using the color specified in clearColor function
	gl.clear(gl.COLOR_BUFFER_BIT);
	//configures the graphical primitive 
	let primitive;
	if (wireframe)
		primitive = gl.LINE_LOOP;
	else
		primitive = gl.TRIANGLE_FAN;

	let nPontACC = 0;
	for (let i = 0; i < nPoly; i++) {
		//gets "uniform" variable from buffer
		let vColor = gl.getUniformLocation(program, "u_color");
		//sets a random color
		gl.uniform4f(vColor, Math.random(), Math.random(), Math.random(), 1);

		// draws a polygon with numPontos[i] vertexes
		gl.drawArrays(primitive, nPontACC, numPontos[i]);
		nPontACC += numPontos[i];
	}
}