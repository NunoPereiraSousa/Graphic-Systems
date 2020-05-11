let renderer, scene, camera;

let directionalLight; // Light
let plane, tank, base, tower, cannon;
let cameraChange;

// once everything is loaded, we run our Three.js stuff
window.onload = function init() {
    /*********************
     * SCENE 
     * *******************/
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    let axes = new THREE.AxesHelper(500);
    scene.add(axes)

    /*********************
     * CAMERA 
     * *******************/
    // create a camera and a perspective projection
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    //set the camera's view transformation
    camera.position.set(0, 50, 70);
    camera.lookAt(0, 0, 0); // lookat

    /*********************
     * RENDERER 
     * *******************/
    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1.0);

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);

    /*********************
     * CONTROLS 
     * *******************/
    let controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    /*****************************
     * MESHES
     * ***************************/
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshBasicMaterial({
            color: 0x777777,
            side: THREE.DoubleSide
        }));
    plane.rotateX(Math.PI / 2)
    scene.add(plane);

    base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1, 7),
        new THREE.MeshBasicMaterial({
            color: 0x008800,
            map: new THREE.TextureLoader().load("./images/camouflage.jpg")
        })
    );
    base.position.set(0, 0.5, 0)
    scene.add(base);

    tower = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 2),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            map: new THREE.TextureLoader().load("./images/camouflage.jpg")
        })
    );
    tower.position.set(0, 1, -1)
    base.add(tower);

    cannon = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 4),
        new THREE.MeshBasicMaterial({
            color: 0xffff00,
            map: new THREE.TextureLoader().load("./images/camouflage.jpg")
        })
    );
    cannon.position.set(0, 1, 2)
    base.add(cannon);

    /*****************************
     * LIGHTS 
     ****************************/

    // Directional light
    directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0.3, 0.6, 1);
    directionalLight.visible = false;
    scene.add(directionalLight);

    directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 100);
    directionalLightHelper.visible = false;
    scene.add(directionalLightHelper);

    // Add key handling
    document.onkeydown = handleKeyDown;

    animation()

    /*****************************
     * RENDER 
     * ***************************/
    renderer.render(scene, camera);
}

function animation() {
    requestAnimationFrame(animation);

    if (cameraChange) {
        camera.position.set(0, 50, 70);
        camera.lookAt(0, 0, 0);
    } else {
        let relativeOffset = new THREE.Vector3(0, 5, -15);
        // updates the offset with the object‘s global transformation matrix
        let cameraOffset = relativeOffset.applyMatrix4(base.matrixWorld);
        // updates the camera position with the new offset
        camera.position.copy(cameraOffset);
        // camera looks at the object’s position
        camera.lookAt(base.position);
    }

    renderer.render(scene, camera);
}

function handleKeyDown(e) {
    let key = e.key;

    switch (key) {
        case "w":
            // base.position.x += 0.1 * Math.sin(base.rotation.y);
            base.position.z += 0.1 * Math.cos(base.rotation.y);            
            break;
        case "s":
            base.position.z -= 0.1 * Math.cos(base.rotation.y); 
            break;
        case "a":
            base.rotation.y += 0.01;
            break;
        case "d":
            base.rotation.y -= 0.01;
            break;
            // Rotate tower to the right
        case "z":
            tower.rotation.y += 0.01;
            break;
            // Rotate tower to the left
        case "x":
            tower.rotation.y -= 0.01;
            break;
            // Rotate cannon to the right
        case "v":
            cannon.rotation.y += 0.01;
            break;
            // Rotate cannon to the left
        case "b":
            cannon.rotation.y -= 0.01;
            break;
            // Rotate cannon to the left
        case "c":
            cameraChange = !cameraChange
            break;
        default:
            break;
    }

    /*****************************
     * RENDER 
     * ***************************/
    renderer.render(scene, camera);
}