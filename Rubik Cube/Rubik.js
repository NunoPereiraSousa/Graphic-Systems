let renderer, scene, camera;
let controls;

//array to store all 100 cube meshes
let cubes = [];

//KEY A: array of materials - one per faces with same normal
let matArray = [];
matArray.push(new THREE.MeshBasicMaterial({
    color: 0x009e60
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0x0051ba
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0xffd500
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0xff5800
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0xC41E3A
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0xffffff
}));

let size;
let positionX, positionY, positionZ;
let material;
let incX = 0,
    incY = 3.1;

window.onload = function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 200);
    // position and point the camera to the center of the scene
    camera.position.set(0, 5, 50);
    camera.lookAt(scene.position);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    //show canvas
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    //cubes
    const mainCube = new THREE.Object3D();
    scene.add(mainCube);
    mainCube.position.set(0, 0, 0);

    function newCube(x, y, z) {
        let geometry = new THREE.BoxGeometry(3, 3, 3);
        matArray.flatShading = true;
        let cube = new THREE.Mesh(geometry, matArray);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.position.set(x, y, z);
        scene.add(cube)
    }

    let centerCube = 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                let x = i * 3.1 - centerCube;
                let y = j * 3.1 - centerCube;
                let z = k * 3.1 - centerCube;
                newCube(x, y, z)
            }
        }
    }

    // lights
    let ambientLight = new THREE.AmbientLight(0x404040, 0.5); // soft white light
    scene.add(ambientLight);

    let pointLight = new THREE.PointLight(0xff0000, 1.5, 100);
    pointLight.position.set(0, 25, 80);
    scene.add(pointLight);

    renderer.render(scene, camera);

}