let renderer, scene, camera;

let earth, clouds, galaxy;

window.onload = function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    // position and point the camera to the center of the scene
    camera.position.z = 3;
    camera.lookAt(scene.position);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    let controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    //show canvas
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // material.map = texture;
    earth = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load("../images/no_clouds_4k.jpg"),
            bumpMap: new THREE.TextureLoader().load("../images/elev_bump_4k.jpg"),
            bumpScale: 0.015
        }));
    scene.add(earth);

    clouds = new THREE.Mesh(
        new THREE.SphereGeometry(1.005, 32, 32),
        new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load("../images/fair_clouds_4k.png"),
            transparent: true
        }));
    scene.add(clouds);

    galaxy = new THREE.Mesh(
        new THREE.SphereGeometry(50, 32, 32),
        new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load("../images/galaxy_starfield.png"),
            side: THREE.BackSide
        }));
    scene.add(galaxy);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight);

    // Ambient lights
    let ambientLight = new THREE.AmbientLight(0x333333, 0.5);
    scene.add(ambientLight);

    animation()

    renderer.render(scene, camera);
}

function animation() {
    requestAnimationFrame(animation);

    earth.rotation.y += 0.00015;
    clouds.rotation.y += 0.0002;

    renderer.render(scene, camera);
}