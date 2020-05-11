//GLOBALS
let gl;
let wireframe = false;

let nPoly = 0; //total number of polygons to draw
let numPontos = []; //array with the number of vertices (per polygon)
let vertices = []; //array withh all the vertices (per polygon)
let colors = []; //array withh all the colors (per polygon)

let bufferId; //position buffer 
let colorBuffer; //color buffer

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
	bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId); //binds it later

	let vPosition = gl.getAttribLocation(program, "vPosition"); //obtém variável do buffer
	gl.enableVertexAttribArray(vPosition);

	// Associate shader position attribute with buffer
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

	// vertex colors
	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); // o gl.ARRAY_BUFFER contém todos os atributos de um vértice (posição, cor e textura)

	let colorLocation = gl.getAttribLocation(program, "vColor"); //obtém variável do buffer
	gl.enableVertexAttribArray(colorLocation);

	// Associate shader color attribute with buffer
	gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

	desenhaPoligonos();
};

function poligono(xCentro, yCentro, raio) {
	const alpha = 2 * Math.PI / 3;
	let ang = 0;
	let pontos = [];

	for (i = 0; i < 3; i++) {
		let x = xCentro + raio * Math.cos(ang);
		let y = yCentro + raio * Math.sin(ang);
		pontos.push(x);
		pontos.push(y);
		ang += alpha;

		colors.push(Math.random());
		colors.push(Math.random());
		colors.push(Math.random());
		// colors.push(1);
	}
	return pontos;
}

function desenhaPoligonos() {
	let raio = parseFloat(document.getElementById('raio').value);
	let xCentro = parseFloat(document.getElementById('xCentro').value);
	let yCentro = parseFloat(document.getElementById('yCentro').value);

	//add the new vertices
	vertices = vertices.concat(poligono(xCentro, yCentro, raio));
	// uploads geometric data into GPU
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	// uploads color data into GPU
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

	nPoly++;

	render();
}

function handleKeyDown(e) {
	switch (String.fromCharCode(e.keyCode)) {
		case "w":
		case "W":
			wireframe = !wireframe;
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
		primitive = gl.TRIANGLES;

	let nPontACC = 0;
	for (let i = 0; i < nPoly; i++) {
		//draw a triangle
		gl.drawArrays(primitive, nPontACC, 3);
		nPontACC += 3;
	}
}