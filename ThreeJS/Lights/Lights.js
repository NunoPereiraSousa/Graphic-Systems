let renderer, scene, camera;

let ambientLight, spotLight, directionalLight, pointLight; // Lights
let spotLightLightHelper, directionalLightHelper, pointLightHelper; // Light Helpers

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
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 4000);
    //set the camera's view transformation
    camera.position.set(-200, 350, 650); // eye
    camera.lookAt(0, 0, 0); // lookat

    /*********************
     * RENDERER 
     * *******************/
    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x66ccff, 1.0);

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
    let material = new THREE.MeshBasicMaterial({
        color: 0x0087E6
    });

    let torus = new THREE.Mesh(new THREE.TorusBufferGeometry(50, 10, 16), material);
    torus.position.set(0, 50, 250);
    torus.rotation.x = -90 * Math.PI / 180;
    scene.add(torus);

    let cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0, 50, 100), material);
    cylinder.position.set(150, 50, 0);
    scene.add(cylinder);

    let cube = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), material);
    cube.position.y = 50;
    scene.add(cube);

    let sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 4, 4), material);
    sphere.position.set(-150, 50, 0);
    scene.add(sphere);

    // Create a plane that receives shadows (but does not cast them)
    let planeGeometry = new THREE.PlaneBufferGeometry(10000, 10000, 32, 32);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xb69a77,
        side: THREE.DoubleSide
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = "plane"
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    scene.add(plane);

    /*****************************
     * LIGHTS 
     ****************************/
    //ambient light
    ambientLight = new THREE.AmbientLight(0x404040, 2);
    ambientLight.visible = true;
    scene.add(ambientLight);

    // SpotLight
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 350, 250)
    spotLight.visible = false;
    spotLight.target = torus;
    scene.add(spotLight);

    spotLightLightHelper = new THREE.SpotLightHelper(spotLight, 100);
    spotLightLightHelper.visible = false;
    scene.add(spotLightLightHelper);

    // Directional light
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(100, 350, 250);
    directionalLight.visible = false;
    scene.add(directionalLight);

    directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 100);
    directionalLightHelper.visible = false;
    scene.add(directionalLightHelper);

    // Point light
    pointLight = new THREE.PointLight(0xff0000, 1);
    pointLight.position.set(100, 350, 250);
    pointLight.visible = false;
    scene.add(pointLight);

    pointLightHelper = new THREE.PointLightHelper(pointLight, 50);
    pointLightHelper.visible = false;
    scene.add(pointLightHelper);

    // Add key handling
    document.onkeydown = handleKeyDown;

    /*****************************
     * RENDER 
     * ***************************/
    renderer.render(scene, camera);
}

function handleKeyDown(e) {
    let char = e.key;

    /*****************************
     * CHANGE MATERIAL 
     ****************************/
    // BASIC
    if (char == "b") {
        //Go through all children of the scene object and search for a Mesh
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh && child.name == "") {
                child.material = new THREE.MeshBasicMaterial({
                    color: 0x0087E6
                });
            }
        });
    }
    // LAMBERT
    else if (char == "l") {
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh && child.name == "") {
                child.material = new THREE.MeshLambertMaterial({
                    color: 0x0087E6
                });
            }
        });
    }
    //PHONG (SMOOTH SHADING)
    else if (char == "p") {
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh && child.name == "") {
                child.material = new THREE.MeshPhongMaterial({
                    color: 0x0087E6,
                    shininess: 100
                });
            }
        });
    }

    /*****************************
     * CHANGE LIGHTS 
     ****************************/
    if (char == "1") {
        ambientLight.visible = !ambientLight.visible;
    }
    if (char == "2") {
        spotLight.visible = !spotLight.visible;
        spotLightLightHelper = !spotLightLightHelper.visible;
    }
    if (char == "3") {
        directionalLight.visible = !directionalLight.visible;
        directionalLightHelper.visible = !directionalLightHelper.visible;
    }
    if (char == "4") {
        pointLight.visible = !pointLight.visible;
        pointLightHelper.visible = !pointLightHelper.visible;
    }

    /*****************************
     * RENDER 
     * ***************************/
    renderer.render(scene, camera);
}