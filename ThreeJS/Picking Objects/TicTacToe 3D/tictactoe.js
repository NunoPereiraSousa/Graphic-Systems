let renderer, scene, camera, mouse = {
        x: 0,
        y: 0
    },
    mouse2 = {
        x: 0,
        y: 0
    }
raycaster = new THREE.Raycaster();
let sphere;

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("mousedown", onMouseMove2, false);

window.onload = function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 200);
    // position and point the camera to the center of the scene
    camera.position.set(40, 50, 90);
    camera.lookAt(scene.position);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#000");
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.getElementById('canvas-container').appendChild(renderer.domElement);

    createSphere();
    animate();
}

function newSphere(x, y, z) {
    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        }));
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.set(x, y, z);
    scene.add(sphere)
}

function createSphere() {
    let centerBall = 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                let x = i * 10.1 - centerBall;
                let y = j * 10.1 - centerBall;
                let z = k * 10.1 - centerBall;
                newSphere(x, y, z)
            }
        }
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseMove2(event) {
    mouse2.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse2.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    ballsColorMouseMove();
    ballsColorMouseClick();
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

function ballsColorMouseMove() {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for (var i = 0; i < intersects.length; i++) {
        intersects[i].object.material.color.set(0xf9d71c); // yellow
    }
}

let green = new THREE.Color("rgb(34,139,34)");
let red = new THREE.Color("rgb(255, 0, 0)");

function ballsColorMouseClick() {
    raycaster.setFromCamera(mouse2, camera);

    const intersects2 = raycaster.intersectObjects(scene.children);

    for (var i = 0; i < intersects2.length; i++) {
        intersects2[i].object.material.color.set(green);
    }
}