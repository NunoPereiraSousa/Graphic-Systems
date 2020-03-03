let canvas, context;
window.onload = function () {
    canvas = document.getElementById('myCanvas');
    if (canvas.getContext) {
        context = canvas.getContext("2d");
    }
}

let points = [];

function insere() {
    let p = {
        x: parseFloat(document.getElementById('px').value),
        y: parseFloat(document.getElementById('py').value)
    };
    points.push(p);
    if (canvas) {
        context.fillStyle = "blue";
        context.beginPath();
        context.arc(p.x, p.y, 3, 0, 2 * Math.PI);
        context.fill();
    }
}

// Converte ângulo de graus para radianos
function deg2rad(ang) {
    return (Math.PI * ang / 180);
}

// Converte ângulo de radianos para graus
function rad2deg(ang) {
    return (180 * ang / Math.PI);
}

function desenha() {
    //TODO: desenhar polígono definido por todos os pontos inseridos (nº de pontos tem de ser >= 3)
    if (canvas && points.length > 2) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.closePath();
        context.stroke();
    }
}

function desloca() {
    let d = {
        x: parseFloat(document.getElementById('dx').value),
        y: parseFloat(document.getElementById('dy').value)
    };
    desenha();
    if (canvas && points.length > 2) {
        context.beginPath();
        context.moveTo(points[0].x + d.x, points[0].y + d.y);
        for (let i = 0; i < points.length; i++) {
            context.lineTo(points[i].x + d.x, points[i].y + d.y);
        }
        context.closePath();
        context.stroke();
    }

}

function escala() {
    let s = {
        x: parseFloat(document.getElementById('sx').value),
        y: parseFloat(document.getElementById('sy').value)
    };
    desenha();
    if (canvas && points.length > 2) {
        context.beginPath();
        context.strokeStyle = 'red';
        context.moveTo(points[0].x * s.x, points[0].y * s.y);
        for (let i = 0; i < points.length; i++) {
            context.lineTo(points[i].x * s.x, points[i].y * s.y);
        }
        context.closePath();
        context.stroke();
    }
}

function roda() {
    let theta = parseFloat(document.getElementById('theta').value);
    //converte para radianos
    theta = Math.PI * theta / 180;
    desenha();
    if (canvas && points.length > 2) {
        context.beginPath();
        context.strokeStyle = 'cyan';
        context.moveTo(points[0].x * Math.cos(theta) - points[0].y * Math.sin(theta), 
        points[0].x * Math.sin(theta) + points[0].y * Math.cos(theta));
        for (let i = 0; i < points.length; i++) {
            context.lineTo(points[i].x * Math.cos(theta) - points[i].y * Math.sin(theta), 
            points[i].x * Math.sin(theta) + points[i].y * Math.cos(theta));
        }
        context.closePath();
        context.stroke();
    }
}