let renderer, scene, camera;
let shoulder, upperArm, elbow, lowerArm, material;

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
    material = new THREE.MeshNormalMaterial({
        wireframe: false
    });
    let geometry = new THREE.BoxGeometry(2, 0.5, 1);
    // cube = new THREE.Mesh(geometry, material);

    // Add the shoulder mesh TO THE SCENE
    shoulder = new THREE.Object3D();
    scene.add(shoulder);
    // END Add the shoulder mesh TO THE SCENE

    // Add the cube mesh TO THE cubePivot
    upperArm = new THREE.Mesh(geometry, material);
    shoulder.add(upperArm);
    // END Add the cube mesh TO THE cubePivot

    // Add the elbow mesh TO THE cubePivot
    // Create elbow
    elbow = new THREE.Object3D();
    shoulder.add(elbow);
    // END Add the elbow mesh TO THE cubePivot
    // Move the sphere diagonally FROM THE CUBE
    elbow.position.set(1, 0, 0);

    // Create the sphere mesh (with axis)
    lowerArm = new THREE.Mesh(geometry, material);
    lowerArm.position.set(1, 0, 0);

    // Add the sphere mesh TO THE SPHERE GROUP
    elbow.add(lowerArm);


    /*************************
     * AXES HELPER
     *************************/
    // show SCENE axes
    let axes = new THREE.AxesHelper(4);
    scene.add(axes);

    // Run the run loop
    animate();
}

document.onkeydown = function handleKeyDown(e) {
    switch (e.key) {
        case "r":
            // Rotate shoulder group in X axis
            shoulder.rotation.x += 0.02;
            break;
        case "s":
            // Rotate the shoulder group in Z axis
            if (shoulder.rotation.z <= Math.PI / 2) {
                shoulder.rotation.z += 0.02;
            }
            break;
        case "S":
            // Rotate the shoulder group in Z axis
            if (shoulder.rotation.z >= -Math.PI / 2) {
                shoulder.rotation.z -= 0.02;
            }
            break;
        case "e":
            // Rotate the shoulder in Z axis
            if (elbow.rotation.z <= Math.PI / 1.4) {
                elbow.rotation.z += 0.02;
            }
            break;
        case "E":
            // Rotate the elbow in Z axis
            if (elbow.rotation.z >= -Math.PI / 1.4) {
                elbow.rotation.z -= 0.02;
            }
            break;
        case "t":
            material.wireframe == false ? material.wireframe = true : material.wireframe = false
            break;
        default:
            // Reset 
            shoulder.rotation.x = 0;
            shoulder.rotation.z = 0;
            elbow.rotation.z = 0;
            break;
    }
}


function animate() {
    // animate using requestAnimationFrame
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}