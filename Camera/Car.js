let renderer = null,
    scene = null,
    camera = null,
    car; // The three.js object that represents the car model

window.onload = function init() {
    // Create the Three.js renderer
    renderer = new THREE.WebGLRenderer();
    // Set the viewport 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#AAAAAA");
    document.body.appendChild(renderer.domElement);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.y = 160;
    camera.position.z = 200;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // Lights
    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 300, 200);
    scene.add(pointLight);

    let ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    // Floor
    let gridXZ = new THREE.GridHelper(5000, 50, 0xff0000, 0xffffff);
    scene.add(gridXZ);

    // Car model
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./models/toycar.mtl', function (materials) {
        materials.preload();
        let loader = new THREE.OBJLoader();
        loader.setMaterials(materials);
        loader.load('./models/toycar.obj', function (object) {
            car = object;
            car.scale.set(0.2, 0.2, 0.2);
            scene.add(car);
        });
    });

    // let controls = new THREE.OrbitControls(camera);
    // controls.addEventListener('change', function () { renderer.render(scene, camera); });

    document.addEventListener("keydown", doKey);

    // Run the animation loop
    render();
}

// car position
let pos = new THREE.Vector3(0, 0, 0);
// car angle: by default, the car is facing +Z direction
// so, add a rotation of PI/2 to make the car facing -Z direction
let angle = Math.PI;

function render() {
    if (car != undefined) {
        // sets the toycar object with the updated position
        car.position.set(pos.x, pos.y, pos.z);
        // rotates the car by angle radians
        car.rotation.y = (angle);
        // camera TO object relative offset
    let relativeOffset = new THREE.Vector3(0, 200, -200);
    // updates the offset with the object‘s global transformation matrix
    let cameraOffset = relativeOffset.applyMatrix4(car.matrixWorld);
    // updates the camera position with the new offset
    camera.position.copy(cameraOffset);
    // camera looks at the object’s position
    camera.lookAt(car.position);
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

// key handling
function doKey(event) {
    let key = event.key;
    switch (key) {
        case "w":
            pos.z--;
            break;
        case "s":
            pos.z++;
            break;
        case "a":
            car.rotation.y += angle / 0.02;
            break;
        case "d":
            car.rotation.y -= angle / 0.02;
            break;
        default:
            break;
    }
    // renderer.render(scene, camera);
    // pos.z--;
}