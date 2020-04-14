let cube, sphere;
let renderer, scene, camera;

let movement = -1; //no ratations

// once everything is loaded, we run our Three.js stuff
function init() {

    const canvas = document.getElementById("webglcanvas");

    /*********************
     * SCENE 
     * *******************/
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    /*********************
     * CAMERA 
     * *******************/
    // create a camera, which defines where we're looking at
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.set(2, 2, 15);
    scene.add(camera);

    /*********************
     * RENDERER 
     * *******************/
    // create a render and set the size
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);

    // configure renderer clear color
    renderer.setClearColor("#000000");

    /*****************************
     * CUBE 
     * ***************************/
    cube = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2, 10, 10, 10),
        new THREE.MeshNormalMaterial({ wireframe: true }));
    // add the cube to the scene
    cube.position.set(2, 0, 0);
    scene.add(cube);


    /*****************************
     * SPHERE 
     * ***************************/
    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 10, 10),
        new THREE.MeshNormalMaterial({ wireframe: true }));
    // sphere is cube's child
    cube.add(sphere);

    // rotate the cube around its axes
    sphere.position.set(3, 3, 0);


    /*************************
     * AXES HELPER
     *************************/
    // show SCENE axes
    let axes = new THREE.AxesHelper(4);
    scene.add(axes);

    // show CUBE axes
    let axes2 = new THREE.AxesHelper(2);
    cube.add(axes2);

    // show SPHERE axes
    let axes3 = new THREE.AxesHelper(2);
    sphere.add(axes3);

    // Add key handling
    document.onkeydown = handleKeyDown;


    // Run the animation loop
    animate();
}

function handleKeyDown(e) {
    let char = e.key;
    switch (char) {
        case "1":
        case "2":
            movement = parseInt(char);
            break;
        default:
            movement = -1;
            break;
    }
}

function animate() {
    switch (movement) {
        case 1:
            // Rotate cube about its Y axis
            cube.rotation.y += 0.02;
            break;
        case 2:
            // Rotate the sphere about its Y axis
            sphere.rotation.y += 0.02;
            break;
        default:
            // Reset 
            cube.rotation.y = 0;
            sphere.rotation.y = 0;
            break;
    }

    // animate using requestAnimationFrame
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

