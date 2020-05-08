let renderer, scene, camera;

let earth, clouds, galaxy;

window.onload = function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    // position and point the camera to the center of the scene
    camera.position.set(0, 150, 400);
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

    scene = new THREE.Scene();
    scene.background = new THREE.CubeTextureLoader()
        .setPath('../')
        .load([
            '/images/dawnmountain-xpos.png', '/images/dawnmountain-xneg.png',
            '/images/dawnmountain-ypos.png', '/images/dawnmountain-yneg.png',
            '/images/dawnmountain-zpos.png', '/images/dawnmountain-zneg.png'
        ]);

    // Plane texture
    planeTexture = new THREE.TextureLoader().load("../images/checkerboard.jpg")
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(10, 10);

    // Plane
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: planeTexture
        }));
    plane.rotateX(Math.PI / 2)
    scene.add(plane);

    animation()

    renderer.render(scene, camera);
}

function animation() {
    requestAnimationFrame(animation);



    renderer.render(scene, camera);
}