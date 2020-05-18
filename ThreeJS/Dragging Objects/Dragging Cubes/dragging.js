let renderer, scene, camera, mouse = {
        x: 0,
        y: 0
    },
    raycaster = new THREE.Raycaster();
let cube1, cube2, plane, objects = [];

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

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    createObjects();
    drag();

    animate();
}

function createObjects() {
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000, 10, 10),
        new THREE.MeshBasicMaterial({
            opacity: 0.0,
            transparent: true,
            visible: false
        })
    );
    scene.add(plane);
    objects.push(plane)
    cube1 = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshBasicMaterial({
            color: 0x363636
        }));
    cube1.position.set(-30, 10, 0);
    cube1.name = "cube1";
    plane.add(cube1);

    cube2 = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshBasicMaterial({
            color: 0x99999
        }));
    cube2.position.set(30, 10, 0);
    cube2.name = "cube2";
    plane.add(cube2);
}

function drag() {
    let dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function (event) {
        controls.enabled = false;
    });
    dragControls.addEventListener('dragend', function (event) {
        controls.enabled = true;
    });
}

function animate() {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}