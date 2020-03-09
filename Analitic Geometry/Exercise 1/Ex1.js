let canvas, context;
window.onload = function () {
	canvas = document.getElementById('myCanvas');
	if (canvas.getContext) {
		context = canvas.getContext("2d");
	}
}

// Limpa UI
function clean() {
	//dados de entrada
	document.getElementById("p1x").value = "";
	document.getElementById("p1y").value = "";
	document.getElementById("p2x").value = "";
	document.getElementById("p2y").value = "";
	document.getElementById("n").value = "";
	//dados de saída (resultados)
	document.getElementById("res").innerHTML = "<tr><th colspan='2'>RESULTADOS</th></tr><tr><td>Ponto médio</td><td id='pontomedio'></td></tr><tr><td>Distância</td><td id='dist'></td></tr>";
	if (canvas)
		context.clearRect(0, 0, canvas.width, canvas.height);
}

// Arredonda valores em vírgula flutuante
function _round(value, precision) {
	let mult = Math.pow(10, precision);
	return (Math.floor(value * mult) / mult);
}

// Converte ângulo de graus para radianos
function deg2rad(ang) {
	return (Math.PI * ang / 180);
}

// Converte ângulo de radianos para graus
function rad2deg(ang) {
	return (180 * ang / Math.PI);
}

function calcula() {
	let p1 = {
		x: parseFloat(document.getElementById('p1x').value),
		y: parseFloat(document.getElementById('p1y').value)
	};
	let p2 = {
		x: parseFloat(document.getElementById('p2x').value),
		y: parseFloat(document.getElementById('p2y').value)
	};
	let n = parseFloat(document.getElementById('n').value);

	//alínea a)
	let res = document.getElementById("pontomedio");
	let middleX = (p1.x + p2.x) / 2;
	let middleY = (p1.y + p2.y) / 2;
	res.innerHTML = `(${middleX}, ${middleY})`;

	//alínea b)
	res = document.getElementById("dist");
	res.innerHTML += ""; //TODO: colocar aqui a resposta à alinea b)
	let x = Math.pow(p2.x - p1.x, 2);
	let y = Math.pow(p2.y - p1.y, 2);
	res.innerHTML = parseInt(Math.sqrt(x + y));

	if (canvas) {
		//TODO: desenhar o segmento de reta definido pelos dois pontos
		context.beginPath();
		context.strokeStyle = '#ff0000';
		context.arc(middleX, middleY, Math.sqrt(x + y) / 2, 0, Math.PI * 2, false);
		context.stroke();

		context.beginPath();
		context.strokeStyle = '#000';
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		context.stroke();
	}

	//alínea c)
	res = document.getElementById("res");
	res.innerHTML += "<tr><th colspan='2'>Alínea c)</th></tr>";
	let ang = 0

	for (i = 0; i < n; i++) {
		//TODO: colocar aqui a resposta à alinea c) e desenhar no Canvas os pontos a VERDE
		let xCircle = ((p1.x + p2.x) / 2) + (Math.sqrt(x + y) / 2) * Math.cos(ang)
		let yCircle = ((p1.y + p2.y) / 2) + (Math.sqrt(x + y) / 2) * Math.sin(ang)
		res.innerHTML += `<tr>
							<td>Ponto ${i + 1}</td>
							<td>(${_round(xCircle, 3)}, ${_round(yCircle, 3)})</td>
						</tr>`;
		ang += 2 * Math.PI / n

		context.fillStyle = 'green';
		context.fillRect(xCircle - 2.5, yCircle - 2.5, 5, 5);

	}

	//alínea d)
	res.innerHTML += "<tr><th colspan='2'>Alínea d)</th></tr>";
	let initAng = Math.atan2(p2.y - p1.y, p2.x - p1.x);
	for (i = 0; i < n; i++) {
		//TODO: colocar aqui a resposta à alinea d) e desenhar no Canvas os pontos a AZUL
		let xCircle = (p1.x + p2.x) / 2 + (Math.sqrt(x + y) / 2) * Math.cos(initAng)
		let yCircle = (p1.y + p2.y) / 2 + (Math.sqrt(x + y) / 2) * Math.sin(initAng)

		res.innerHTML += `<tr>
							<td>Ponto ${i + 1}</td>
							<td>(${_round(xCircle, 3)}, ${_round(yCircle, 3)})</td>
						</tr>`;
		initAng += 2 * Math.PI / n;
		if (canvas) {
			context.fillStyle = 'blue';
			context.beginPath();
			context.fillRect(xCircle - 2.5, yCircle - 2.5, 5, 5);
		}
	}
}