let cube;
let renderer, scene, camera;
let controls;

// once everything is loaded, we run our Three.js stuff
window.onload = function init() {
    /*********************
     * SCENE 
     * *******************/
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    /*********************
     * CAMERA 
     * *******************/
    // create a camera, which defines where we're looking at
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(90, aspect, 0.1, 100);
    camera.position.z = 10;
    camera.position.y = 2;
    camera.position.x = 0;
    /*********************
     * RENDERER 
     * *******************/
    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // configure renderer clear color
    renderer.setClearColor("#000000");

    // add the output of the renderer to an HTML element (this case, the body)
    document.querySelector("#canvas").appendChild(renderer.domElement);

    let plane = new THREE.PlaneGeometry(12, 8);
    let plane1 = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({
        color: 0x008000,
        side: THREE.DoubleSide
    }));
    plane1.position.set(0, 0, 2);
    plane1.rotateX(Math.PI / 2)
    scene.add(plane1);

    let tree = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.5, 2),
        new THREE.MeshBasicMaterial({
            color: "darkgreen"
        }))
    tree.position.set(5, 1, 5)
    scene.add(tree);

    let ball = new THREE.Mesh(new THREE.SphereGeometry(0.5, 30),
        new THREE.MeshBasicMaterial({
            color: "white"
        }))
    let ball1 = new THREE.Mesh(new THREE.SphereGeometry(0.5 * 0.8, 30),
        new THREE.MeshBasicMaterial({
            color: "white"
        }))
    let ball2 = new THREE.Mesh(new THREE.SphereGeometry(0.5 * 0.8 * 0.8, 30),
        new THREE.MeshBasicMaterial({
            color: "white"
        }))
    ball.position.set(-1, 0.5, 5)
    ball1.position.set(-1, 1.3, 5)
    ball2.position.set(-1, 1.98, 5)
    scene.add(ball);
    scene.add(ball1);
    scene.add(ball2);

    // let axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
    
    createHouse(1, 2, 0);
}

function createHouse(width, height, length) {
    const w = width
    const h = height
    const l = length
    let houseGeometry = new THREE.Geometry()

    // Front Vertices
    houseGeometry.vertices.push(
        new THREE.Vector3(0, 0, 0), // 0
        new THREE.Vector3(w, 0, 0), // 1
        new THREE.Vector3(w, h, 0), // 2
        new THREE.Vector3(0, h, 0), // 3
        new THREE.Vector3(w / 2, h + 0.5 * h, 0) // 4
    )

    houseGeometry.faces.push(new THREE.Face3(0, 1, 2))
    houseGeometry.faces.push(new THREE.Face3(0, 2, 3))
    houseGeometry.faces.push(new THREE.Face3(3, 2, 4))

    // Back Vertices
    houseGeometry.vertices.push(
        new THREE.Vector3(0, 0, -1), // 5
        new THREE.Vector3(w, 0, -1), // 6
        new THREE.Vector3(w, h, -1), // 7
        new THREE.Vector3(0, h, -1), // 8
        new THREE.Vector3(w / 2, h + 0.5 * h, -1) // 9
    )

    houseGeometry.faces.push(new THREE.Face3(5, 7, 6));
    houseGeometry.faces.push(new THREE.Face3(5, 8, 7));
    houseGeometry.faces.push(new THREE.Face3(7, 8, 9));

    // Left Vertices
    houseGeometry.faces.push(new THREE.Face3(0, 3, 5))
    houseGeometry.faces.push(new THREE.Face3(3, 8, 5))
    houseGeometry.faces.push(new THREE.Face3(8, 4, 9))
    houseGeometry.faces.push(new THREE.Face3(8, 3, 4))

    // Right Vertices
    houseGeometry.faces.push(new THREE.Face3(1, 6, 2))
    houseGeometry.faces.push(new THREE.Face3(6, 7, 2))
    houseGeometry.faces.push(new THREE.Face3(2, 7, 4))
    houseGeometry.faces.push(new THREE.Face3(7, 9, 4))


    let material = new THREE.MeshNormalMaterial({
        wireframe: false
    });
    let house1 = new THREE.Mesh(houseGeometry, material);
    let house2 = new THREE.Mesh(houseGeometry, material);
    let house3 = new THREE.Mesh(houseGeometry, material);

    houseGeometry.computeFaceNormals()
    house1.position.set(3, 0, 2.8);
    house1.scale.x = 2
    house1.rotateY(2 * Math.PI / -50)

    house2.position.set(0, 0, 2);
    house2.scale.x = 2
    house2.rotateY(2 * Math.PI / 50)

    house3.position.set(-5, 0, 2);
    house3.rotateY(2 * Math.PI)
    house3.scale.z = 2.5

    scene.add(house1);
    scene.add(house2);
    scene.add(house3);

    renderer.render(scene, camera);


    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    return houseGeometry
}