let renderer, scene, camera, mouse = {
        x: 0,
        y: 0
    },
    raycaster = new THREE.Raycaster();
let cube;

let material1 = new THREE.MeshBasicMaterial({
    color: 0x6a6a6a
})

let material2 = new THREE.MeshLambertMaterial({
    color: 0xffffff
})

window.addEventListener("mousedown", changeColor, false);

window.onload = function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 200);
    // position and point the camera to the center of the scene
    camera.position.set(50, 100, 100);
    camera.lookAt(scene.position);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#fea234");
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.getElementById('canvas-container').appendChild(renderer.domElement);

    createCube();

    animate();
}

function createCube() {
    cube = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        material1);
    cube.position.set(0, 0, 0);
    cube.name = "cube";
    scene.add(cube);
}

function animate() {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

function changeColor() {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects != null) {
        for (const intersect of intersects) {
            if (intersect.object.name === "cube") {
                if (cube.material == material1) {
                    cube.material = material2
                } else {
                    cube.material = material1
                }
            } 
        }
    }
}

// function onMouseClick(event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }