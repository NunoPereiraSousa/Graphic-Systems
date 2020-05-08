let renderer, scene, camera;

window.onload = function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    // position and point the camera to the center of the scene
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    document.getElementById('canvas-container').appendChild(renderer.domElement);

    texture = new THREE.TextureLoader().load("../images/partial-transparency.png")
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    cube = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshPhongMaterial({
            color: 0x228B22,
            transparent: true,
            map: texture
        }));
    scene.add(cube);

    // Spot light
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.castShadow = true;
    spotLight.position.set(25, 50, 30);

    scene.add(spotLight);

    animation()

    renderer.render(scene, camera);
}

function animation() {
    requestAnimationFrame(animation);

    texture.offset.x += 0.01;
    texture.offset.y += 0.01;

    renderer.render(scene, camera);
}