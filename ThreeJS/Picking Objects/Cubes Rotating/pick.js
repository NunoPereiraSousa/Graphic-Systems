let renderer, scene, camera, mouse = {
        x: 0,
        y: 0
    },
    raycaster = new THREE.Raycaster();
let cube1, cube2;
let stop1 = false, stop2 = false; // controls when the cube should stop rotating

window.addEventListener("mousedown", onMouseClick, false);

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
    renderer.setClearColor("#ff4");
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.getElementById('canvas-container').appendChild(renderer.domElement);

    createCubes();
    createGrid();

    animate();
}

function createCubes() {
    cube1 = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshBasicMaterial({
            color: 0x363636
        }));
    cube1.position.set(-30, 10, 0);
    cube1.name = "cube1";
    scene.add(cube1);

    cube2 = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshBasicMaterial({
            color: 0xfffff8
        }));
    cube2.position.set(30, 10, 0);
    cube2.name = "cube2";
    scene.add(cube2);
}

function createGrid() {
    let size = 80;
    let divisions = 10;

    let gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
}

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    cubesRotation();
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
function cubesRotation() {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    intersects.forEach(intersection => {
        if (intersection.object.name === "cube1" && stop1 == false) {
            cube1.rotation.x += 0.1;
            cube1.rotation.y += 0.1;
            cube1.rotation.z += 0.1;
            if ((cube1.rotation.x, cube1.rotation.y, cube1.rotation.z) >= 2 * Math.PI) {
                cube1.rotation.x = 0;
                cube1.rotation.y = 0;
                cube1.rotation.z = 0;
                stop1 = true;
            }
        }
        if (intersection.object.name === "cube2" && stop2 == false) {
            cube2.rotation.x += 0.1;
            cube2.rotation.y += 0.1;
            cube2.rotation.z += 0.1;
            if ((cube2.rotation.x, cube2.rotation.y, cube2.rotation.z) >= 2 * Math.PI) {
                cube1.rotation.x = 0;
                cube1.rotation.y = 0;
                cube1.rotation.z = 0;
                stop2 = true;
            }
        }
    })
}