// THREEJS RELATED VARIABLES
let scene, renderer, camera;

// 3D Models
let sea, sky, plane;

let tail, cockpit, engine, wing, propeller, blade;

let controls;

window.onload = function init() {
    // set up the scene, the camera and the renderer
    createScene();

    // add objects to the scene
    createPlane();
    createSea();
    createSky();

    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    animate();
}

window.addEventListener("mousemove", e => {
    
})

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
    renderer.setClearColor("#e4e0ba");

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
    //TODO (later - part II)
}

function createSea() {

    // create the geometry (shape) of the cylinder: radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    let geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    // rotate the geometry on the x axis (alters the vertices coordinates, DOES NOT alter the mesh axis coordinates )
    geometry.rotateX(-Math.PI / 2);

    // create the material
    let material = new THREE.MeshBasicMaterial({
        color: 0x68c3c0,
        wireframe: false
    });

    // create the mesh: geometry + material
    sea = new THREE.Mesh(geometry, material);

    // push it a little bit at the bottom of the scene
    sea.position.y = -600;
    
    scene.add(sea);
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
            cube_material = new THREE.MeshBasicMaterial({
                color: 0xd8d0d1,
                wireframe: false
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
    let cockpit_material = new THREE.MeshBasicMaterial({
        color: 0xf25346
    });
    cockpit = new THREE.Mesh(cockpit_geometry, cockpit_material);
    // END COCKPIT

    // ENGINE
    let engine_geometry = new THREE.BoxGeometry(20, 50, 50);
    let engine_material = new THREE.MeshBasicMaterial({
        color: 0xd8d0d1
    });
    engine = new THREE.Mesh(engine_geometry, engine_material);
    engine.position.set(30, 0, 0);
    // END ENGINE

    // TAIL
    let tail_geometry = new THREE.BoxGeometry(15, 20, 5);
    let tail_material = new THREE.MeshBasicMaterial({
        color: 0xf25346
    });
    tail = new THREE.Mesh(tail_geometry, tail_material);
    tail.position.set(-38, 24, 0);
    // END TAIL

    // WING
    let wing_geometry = new THREE.BoxGeometry(40, 8, 150);
    let wing_material = new THREE.MeshBasicMaterial({
        color: 0xf25346
    });
    wing = new THREE.Mesh(wing_geometry, wing_material);
    wing.position.set(-2, 12, 0);
    // END WING

    // PROPELLER
    let propeller_geometry = new THREE.BoxGeometry(20, 10, 10);
    let propeller_material = new THREE.MeshBasicMaterial({
        color: 0x59332e
    });
    propeller = new THREE.Mesh(propeller_geometry, propeller_material);
    propeller.position.set(36, 0, 0);
    // END PROPELLER

    // BLADE
    let blade_geometry = new THREE.BoxGeometry(1, 100, 20);
    let blade_material = new THREE.MeshBasicMaterial({
        color: 0x23190f
    });
    blade = new THREE.Mesh(blade_geometry, blade_material);
    blade.position.set(10, 0, 0);
    // END BLADE

    scene.add(plane);
    plane.add(tail);
    plane.add(cockpit);
    plane.add(engine);
    plane.add(wing);
    plane.add(propeller);
    propeller.add(blade);
}


function animate() {
    //ANIMATE THE PROPELLER

    // rotate the background (use AxesHelper to verify which axis is the rotation one)
    sky.rotation.z += 0.01;
    sea.rotation.z += 0.005;

    // rotate the propeller in the x axis
    propeller.rotation.x += 0.01

    // render
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}