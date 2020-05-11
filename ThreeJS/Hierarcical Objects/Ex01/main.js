let renderer, scene, camera;

let cube, spherePivot, sphere;

let movement = -1; //no rotations

window.onload = function init() {
    const canvas = document.getElementById("webglcanvas");

    /*********************
     * RENDERER 
     * *******************/
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
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
    let material = new THREE.MeshNormalMaterial({
        wireframe: true
    });
    let geometry = new THREE.CubeGeometry(2, 2, 2, 10, 10, 10);
    cube = new THREE.Mesh(geometry, material);

    // Add the cubePivot mesh TO THE SCENE
    cubePivot = new THREE.Object3D();
    scene.add(cubePivot);
    // END Add the cubePivot mesh TO THE SCENE

    // Add the cube mesh TO THE cubePivot
    cubePivot.add(cube);
    // END Add the cube mesh TO THE cubePivot

    // Add the spherePivot mesh TO THE cubePivot
    // Create a group for the sphere and cone objects
    spherePivot = new THREE.Object3D();
    cubePivot.add(spherePivot);
    // END Add the spherePivot mesh TO THE cubePivot
    // Move the sphere diagonally FROM THE CUBE
    spherePivot.position.set(3, 3, 0);

    // Create the sphere mesh (with axis)
    geometry = new THREE.SphereGeometry(1, 20, 20);
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);

    // Add the sphere mesh TO THE SPHERE GROUP
    spherePivot.add(sphere);

    // Create the cone mesh (with axis)
    geometry = new THREE.ConeGeometry(0.5, 1, 32);
    cone = new THREE.Mesh(geometry, material);
    cone.position.set(3, 3, 0);

    spherePivot.add(cone);


    /*************************
     * AXES HELPER
     *************************/
    // show SCENE axes
    let axes = new THREE.AxesHelper(4);
    scene.add(axes);

    // show cubePivot axes
    let axes2 = new THREE.AxesHelper(2);
    cubePivot.add(axes2);

    // show cube axes
    let axes3 = new THREE.AxesHelper(2);
    cube.add(axes3);

    // show SPHEREPIVOT axes
    let axes4 = new THREE.AxesHelper(2);
    spherePivot.add(axes4);

    // show SPHERE axes
    let axes5 = new THREE.AxesHelper(2);
    sphere.add(axes5);

    // show cone axes
    let axes6 = new THREE.AxesHelper(2);
    cone.add(axes6);

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
        case "4":
            movement = parseInt(char);
            break;
        case "5":
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
        case 4:
            cubePivot.rotation.y += 0.02;
            break;
        case 5:
            cone.rotation.x += 0.02;
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