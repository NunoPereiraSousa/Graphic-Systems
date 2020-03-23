let gl;
let program
let angle = 0 //* Variable for the angle variations
let transformation = "rotation" //* Global variable - by default "rotation"
let scaleN = 0 //* Variable for the scale "boundaries"
let scaleInc = 0.01 //* Variable for the scale variations
let pos = 0 //* Variable for the translation "boundaries"
let posInc = 0.01 //* Variable for the position variations
let canRotate = true //* Boolean variable to allows rotation first
let canTranslate = true //* Boolean variable to allows translation first

window.onload = function init() {

	// Gets 3D Canvas context
	let canvas = document.querySelector('#gl-canvas');
	gl = WebGLUtils.setupWebGL(canvas);

	if (!gl) {
		alert("WebGL is not available");
	}

	// sets WebGL viewport and background color
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.8, 0.8, 0.8, 1.0);

	// compiles both vertex and fragment shaders in GPU
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	//triangle data: vertices and colors
	const vertices = new Float32Array([0.5 * this.Math.cos(0), 0.5 * this.Math.sin(0),
		0.5 * this.Math.cos(2 * this.Math.PI / 3), 0.5 * this.Math.sin(this.Math.PI / 3),
		0.5 * this.Math.cos(-2 * this.Math.PI / 3), 0.5 * this.Math.sin(-2 * this.Math.PI / 3)
	]);
	const colors = new Float32Array([1, 0, 0, 1,
		0, 1, 0, 1,
		0, 0, 1, 1
	]);

	// Creates buffer for geometric data
	let vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// Links shader variable to geometric data buffer
	let vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Creates buffer for color data
	let colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

	// Links shader variable to color data buffer
	let vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	render();
};

function render() {
	updateModelView()

	gl.clear(gl.COLOR_BUFFER_BIT);
	// draws a filled triangle with interpolated colors

	gl.drawArrays(gl.TRIANGLES, 0, 3);

	window.requestAnimationFrame(render)
}

function updateModelView() {
	let M = mat4()
	let modelView = gl.getUniformLocation(program, "ModelView");

	switch (transformation) {
		case "rotation":
			M = rotate(angle, 0, 0, 1)
			angle += 1
			gl.uniformMatrix4fv(modelView, false, flatten(M));
			break;
		case "scale":
			M = scalem(scaleN, scaleN, scaleN)
			scaleN += scaleInc
			if (scaleN >= 2 || scaleN <= -1) {
				scaleInc = -scaleInc
			}
			gl.uniformMatrix4fv(modelView, false, flatten(M));
			break;
		case "translation":
			M = translate(pos, 0, 0)
			pos += posInc
			if (pos >= 0.5 || pos <= -0.5) {
				posInc = -posInc
			}
			gl.uniformMatrix4fv(modelView, false, flatten(M));
			break;
		case "rotate&translate":
			if (canRotate = true && angle <= 360) {
				M = rotate(angle, 1, 1, 1)
				angle += 1
				canRotate = false
			} else {
				M = translate(pos, 0, 0)
				pos += posInc
				if (pos >= 0.5 || pos <= -0.5) {
					posInc = -posInc
				}
			}
			gl.uniformMatrix4fv(modelView, false, flatten(M));
			break;
		case "translate&rotate":
			if (canTranslate == true) {
				M = translate(pos, 0, 0)
				pos += posInc
				if (pos >= 0.5 || pos <= -0.5) {
					posInc = -posInc
					canTranslate = false
				}
			} else {
				M = rotate(angle, 1, 1, 1)
				angle += 1
			}
			gl.uniformMatrix4fv(modelView, false, flatten(M));
			break;
		default:
			break;
	}

}

window.addEventListener("keydown", event => {
	switch (event.key) {
		case "r":
			transformation = "rotation"
			break;
		case "t":
			transformation = "translation"
			break;
		case "s":
			transformation = "scale"
			break;
		case "1":
			angle = 0
			canRotate = true
			transformation = "rotate&translate"
			break;
		case "2":
			angle = 0
			canTranslate = true
			transformation = "translate&rotate"
			break;
		default:
			break;
	}
})