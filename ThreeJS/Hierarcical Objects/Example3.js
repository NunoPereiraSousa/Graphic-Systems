let renderer, scene, camera;

let cube, spherePivot, sphere;

let movement = -1; //no rotations

function init() {
    const canvas = document.getElementById("webglcanvas");

    /*********************
     * RENDERER 
     * *******************/
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    // configure renderer clear color
    renderer.setClearColor("#000000");

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


    /*****************************
     * CUBE 
     * ***************************/
    // Create the cube mesh (with axis)
    let material = new THREE.MeshNormalMaterial({ wireframe: false });
    let geometry = new THREE.CubeGeometry(2, 2, 2, 10, 10, 10);
    cube = new THREE.Mesh(geometry, material);

    // Add the cube mesh TO THE SCENE
    scene.add(cube);

    // Create a group for the sphere and cone objects
    spherePivot = new THREE.Object3D();
    // Add it TO THE CUBE
    cube.add(spherePivot);
    // Move the sphere diagonally FROM THE CUBE
    spherePivot.position.set(3, 3, 0);

    // Create the sphere mesh (with axis)
    geometry = new THREE.SphereGeometry(1, 20, 20);
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(3, 3, 0);

    // Add the sphere mesh TO THE SPHERE GROUP
    spherePivot.add(sphere);


    /*************************
    * AXES HELPER
    *************************/
    // show SCENE axes
    let axes = new THREE.AxesHelper(4);
    scene.add(axes);

    // show CUBE axes
    let axes2 = new THREE.AxesHelper(2);
    cube.add(axes2);

    // show SPHEREPIVOT axes
    let axes3 = new THREE.AxesHelper(2);
    spherePivot.add(axes3);

    // show SPHERE axes
    let axes4 = new THREE.AxesHelper(2);
    sphere.add(axes4);


    // Add key handling
    document.onkeydown = handleKeyDown;

    // Run the run loop
    animate();
}

function handleKeyDown(e) {
    var char = e.key;
    switch (char) {
        case "1":
        case "2":
        case "3":
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
            // Rotate cube group its Y axis
            cube.rotation.y += 0.02;
            break;
        case 2:
            // Rotate the sphere about its Y axis
            sphere.rotation.y += 0.02;
            break;
        case 3:
            // Rotate the sphere pivot about its Y axis 
            spherePivot.rotation.y += 0.02;
            break;
        default:
            // Reset 
            cube.rotation.y = 0;
            sphere.rotation.y = 0;
            spherePivot.y = 0;
            break;

    }

    // animate using requestAnimationFrame
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}