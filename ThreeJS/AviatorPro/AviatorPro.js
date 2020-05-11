// THREEJS RELATED VARIABLES
let scene, renderer, camera;

// 3D Models
let sea, sky, plane;

let tail, cockpit, engine, wing, propeller, blade;
let hemisphereLight, directionalLight, directionalLightHelper;
let curve, position = 0;
let mousePos = {
    x: 0,
    y: 0
};
let waves = [];
let controls;

window.onload = function init() {
    // set up the scene, the camera and the renderer
    createScene();

    // add objects to the scene
    createPlane();
    createSea();
    createSky();
    createLights();

    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    animate();

    document.onmousemove = handleMouseMove;
}

//INIT THREE JS, SCREEN, SCENE AND CAMERA
function createScene() {
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    // create a camera, which defines where we're looking at
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

    // position the camera
    camera.position.x = 0;
    camera.position.z = 200; //notice how far the camera is
    camera.position.y = 100;

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // configure renderer clear color
    renderer.setClearColor("#c4e0ba");

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // add the output of the renderer to the DIV with id "world"
    document.getElementById('world').appendChild(renderer.domElement);

    // listen to the screen: if the user resizes it we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    hemisphereLight.visible = true;
    scene.add(hemisphereLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(130, 130, 50)
    directionalLight.visible = true;
    directionalLight.castShadow = true;
    directionalLight.target = plane;

    directionalLight.shadow.camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.5, 1000);

    scene.add(directionalLight);

    // let helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(helper);

    // directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 100);
    // directionalLightHelper.visible = true;
    // scene.add(directionalLightHelper);

    scene.fog = new THREE.Fog(0xf7d9aa, 100);

    curve = new THREE.EllipseCurve(
        0, 0, // ax, aY
        200, 200, // xRadius, yRadius
        0, 2 * Math.PI, // aStartAngle, aEndAngle
        false, // aClockwise
        0 // aRotation
    );
}

function updateLight() {
    if (position <= 1) {
        directionalLight.position.x = curve.getPointAt(position).x
        directionalLight.position.y = curve.getPointAt(position).y
        position += 0.0005
    } else {
        position = 0
    }
}

function createSea() {
    // create the geometry (shape) of the cylinder: radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    let geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    // rotate the geometry on the x axis (alters the vertices coordinates, DOES NOT alter the mesh axis coordinates )
    geometry.rotateX(-Math.PI / 2);

    // create the material
    let material = new THREE.MeshPhongMaterial({
        color: 0x68c3c0,
        transparent: true,
        opacity: 0.6,
        flatShading: true
    });

    // create the mesh: geometry + material
    sea = new THREE.Mesh(geometry, material);

    // push it a little bit at the bottom of the scene

    let vertices = sea.geometry.vertices;
    for (const vertex of vertices) {
        waves.push({
            x: vertex.x,
            y: vertex.y,
            z: vertex.z,
            radius: (Math.random() * 15) + 5,
            angle: Math.random() * Math.PI * 2,
            velocity: (Math.random() * (0.1 - 0.04)) + 0.04
        })
    }
    sea.position.y = -600;
    sea.receiveShadow = true;
    scene.add(sea);
}

function moveWaves() {
    let vertices = sea.geometry.vertices;
    for (let i = 0; i < vertices.length; i++) {
        let wave = waves[i];
        vertices[i].x = wave.x + Math.cos(wave.angle) * wave.radius;
        vertices[i].y = wave.y + Math.sin(wave.angle) * wave.radius;
        wave.angle += wave.velocity;
    }
    sea.geometry.verticesNeedUpdate = true;
}

function createSky() {
    // create an empty container
    sky = new THREE.Object3D();
    // push its center a bit towards the bottom of the screen (like the sea)
    sky.position.y = -600;
    createCloud();
    scene.add(sky);
}

function createCloud() {
    let cube_geometry; // cube geometry
    let cube_material; // cube material
    let cloud; // cloud
    let cube; // cube
    let number_clouds = 20; // number of clouds
    let number_cubes; // number of cubes
    let scale_number; // scale cubes values
    let circle_radius = (Math.random() * (950 - 750) + 750); // random value for circle radius
    let angle = Math.PI * 2 / number_clouds // angle


    for (let i = 0; i < number_clouds; i++) {
        cloud = new THREE.Object3D();
        number_cubes = Math.floor(Math.random() * (10 - 4)) + 4;
        cloud.position.set(circle_radius * Math.cos(i * angle), circle_radius * Math.sin(i * angle), (Math.random() * (-400 + 800) - 800))
        cloud.rotation.z = Math.PI / 2 + (angle * i);

        for (let j = 0; j < number_cubes; j++) {
            cube_geometry = new THREE.BoxGeometry(20, 20, 20);
            cube_material = new THREE.MeshPhongMaterial({
                color: 0xd8d0d1
            });
            scale_number = (Math.random() * (2 - 0.1) + 0.1)

            cube = new THREE.Mesh(cube_geometry, cube_material);
            cube.rotation.y = Math.random() * (2 * Math.PI - 0) + 0;
            cube.rotation.z = Math.random() * (2 * Math.PI - 0) + 0;
            cube.position.set(j * 15, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10))
            cube.scale.set(scale_number, scale_number, scale_number);

            cloud.add(cube);
        }
        sky.add(cloud);
    }
}

function createPlane() {
    // create an empty container
    plane = new THREE.Object3D();

    // scale it down
    plane.scale.set(0.25, 0.25, 0.25);
    // push it up
    plane.position.y = 100;

    // COCKPIT
    let cockpit_geometry = new THREE.BoxGeometry(60, 50, 50);
    let cockpit_material = new THREE.MeshPhongMaterial({
        color: 0xf25346
    });
    cockpit = new THREE.Mesh(cockpit_geometry, cockpit_material);
    cockpit_geometry.vertices[4].y -= 4;
    cockpit_geometry.vertices[5].y -= 4;
    cockpit_geometry.vertices[6].y += 12;
    cockpit_geometry.vertices[7].y += 12;
    // END COCKPIT

    // ENGINE
    let engine_geometry = new THREE.BoxGeometry(20, 50, 50);
    let engine_material = new THREE.MeshPhongMaterial({
        color: 0xd8d0d1
    });
    engine = new THREE.Mesh(engine_geometry, engine_material);
    engine.position.set(30, 0, 0);
    // END ENGINE

    // TAIL
    let tail_geometry = new THREE.BoxGeometry(15, 20, 5);
    let tail_material = new THREE.MeshPhongMaterial({
        color: 0xf25346
    });
    tail = new THREE.Mesh(tail_geometry, tail_material);
    tail.position.set(-38, 24, 0);
    // END TAIL

    // WING
    let wing_geometry = new THREE.BoxGeometry(40, 8, 150);
    let wing_material = new THREE.MeshPhongMaterial({
        color: 0xf25346
    });
    wing = new THREE.Mesh(wing_geometry, wing_material);
    wing.position.set(-2, 0, 0);
    // END WING

    // PROPELLER
    let propeller_geometry = new THREE.BoxGeometry(20, 10, 10);
    let propeller_material = new THREE.MeshPhongMaterial({
        color: 0x59332e
    });
    propeller = new THREE.Mesh(propeller_geometry, propeller_material);
    propeller.position.set(36, 0, 0);
    propeller_geometry.vertices[4].y -= 4;
    propeller_geometry.vertices[5].y -= 4;
    propeller_geometry.vertices[6].y += 4;
    propeller_geometry.vertices[7].y += 4;
    // END PROPELLER

    // BLADE
    let blade_geometry = new THREE.BoxGeometry(1, 100, 20);
    let blade_material = new THREE.MeshPhongMaterial({
        color: 0x23190f
    });
    blade = new THREE.Mesh(blade_geometry, blade_material);
    blade.position.set(10, 0, 0);
    // END BLADE

    // SECOND BLADE
    let blade2 = blade.clone();
    blade2.rotation.x = Math.PI / 2;
    blade2.castShadow = true;
    blade2.receiveShadow = true;
    // END SECOND BLADE

    scene.add(plane);
    plane.add(tail);
    plane.add(cockpit);
    plane.add(engine);
    plane.add(wing);
    plane.add(propeller);
    propeller.add(blade);
    propeller.add(blade2);
}

function updatePlane() {
    let targetY = mousePos.y * 100;
    plane.position.y += (targetY - plane.position.y + 100) * 0.06;
    plane.rotation.z = (targetY - plane.position.y + 100) * 0.01;
    // plane.position.x = targetX;
}

function handleMouseMove(event) {
    let tx = -1 + (event.clientX / window.innerWidth) * 2;
    let ty = 1 - (event.clientY / window.innerHeight) * 2;
    mousePos = {
        x: tx,
        y: ty
    };
}


function animate() {
    //ANIMATE THE PROPELLER

    // rotate the background (use AxesHelper to verify which axis is the rotation one)
    sky.rotation.z += 0.01;
    sea.rotation.z += 0.005;

    plane.traverse(function (child) {
        // if child object is a MESH
        if (child instanceof THREE.Mesh) {
            // it must cast and receive shadows
            child.castShadow = true;
            child.receiveShadow = true;
            console.log(1);

        }
    });

    // rotate the propeller in the x axis
    propeller.rotation.x += 0.1
    updatePlane();
    updateLight();
    moveWaves();
    // render
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}