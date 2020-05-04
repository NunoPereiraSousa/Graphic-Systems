let renderer, scene, camera;
let controls;

//array to store all 100 cube meshes
let cubes = [];

//KEY A: array of materials - one per faces with same normal
let matArray = [];
matArray.push(new THREE.MeshBasicMaterial({
    color: 0x009e60
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0x0051ba
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0xffd500
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0xff5800
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0xC41E3A
}));
matArray.push(new THREE.MeshBasicMaterial({
    color: 0xffffff
}));

let size;
let positionX, positionY, positionZ;
let material;

window.onload = function init() {
    //scene
    scene = new THREE.Scene();

    // let axes = new THREE.AxisHelper(200);
    // scene.add(axes)

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 200);
    // position and point the camera to the center of the scene
    camera.position.set(-5, 20, 100);
    camera.lookAt(scene.position);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    //show canvas
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    //cubes
    function addCube() {
        size = Math.floor(Math.random() * (6 - 3)) + 3;
        let geometry = new THREE.BoxGeometry(size, size, size);
        material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        material.flatShading = true;
        let cube = new THREE.Mesh(geometry, material);
        positionX = Math.floor(Math.random() * (50 + 50)) - 50;
        positionY = Math.floor(Math.random() * 11);
        positionZ = Math.floor(Math.random() * (50 + 50)) - 50;
        cube.position.set(positionX, positionY, positionZ);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cubes.push(cube)

        scene.add(cube);
    }

    for (let i = 0; i < 100; i++) {
        addCube(i);
    }

    // lights
    let ambientLight = new THREE.AmbientLight(0x404040, 0.5); // soft white light
    scene.add(ambientLight);

    let pointLight = new THREE.PointLight(0xff0000, 1.5, 100);
    pointLight.position.set(0, 25, 80);
    scene.add(pointLight);

    renderer.render(scene, camera);

}

//----------------------------------------------------------------------------
// Keyboard Event Functions
//----------------------------------------------------------------------------
document.onkeydown = function handleKeyDown(event) {
    //Get key character
    let key = event.key;
    switch (key) {
        case "n":
            scene.traverse(function (child) {
                if (child instanceof THREE.Mesh && child.name == "") {
                    child.material = new THREE.MeshNormalMaterial();
                }
            });
            break;
        case "d":
            scene.traverse(function (child) {
                if (child instanceof THREE.Mesh && child.name == "") {
                    child.material = new THREE.MeshDepthMaterial();
                }
            });
            break;
        case "l":
            scene.traverse(function (child) {
                if (child instanceof THREE.Mesh && child.name == "") {
                    child.material = new THREE.MeshLambertMaterial({
                        color: 0x7833aa
                    });
                }
            });
            break;
        case "p":
            scene.traverse(function (child) {
                if (child instanceof THREE.Mesh && child.name == "") {
                    child.material = new THREE.MeshPhongMaterial({
                        color: 0x7833aa,
                        shininess: 10,
                        specular: 0x00FF00
                    });
                }
            });
            break;
        case "a":
            cubes.forEach(cube => {
                cube.material = matArray;
                cube.geometry.faces.forEach((face, i) => {
                    face.material = matArray[i];
                });
            });
            break;
        case "f":
            for (let i = 0; i < cubes.length; i++) {
                for (let j = 0; j < 12; j++) {
                    cubes[i].geometry.faces[j].color.setRGB(Math.random(), Math.random(), Math.random());
                }
                cubes[i].material = new THREE.MeshBasicMaterial({
                    vertexColors: THREE.VertexColors
                });
                cubes[i].geometry.colorsNeedUpdate = true;
            }
            break;
        case "w":
            cubes.forEach(cube => {
                cube.visible = false;
            });
            for (let i = 0; i < 100; i++) {
                let size = Math.floor(Math.random() * (6 - 3)) + 3;
                let cube2 = new THREE.SceneUtils.createMultiMaterialObject(
                    new THREE.BoxGeometry(size, size, size),
                    [
                        new THREE.MeshDepthMaterial(),
                        new THREE.MeshBasicMaterial({
                        color: 0x008000,
                        wireframe: false,
                        transparent: true,
                        blending: THREE.MultiplyBlending
                    })]
                );
                let positionX = Math.floor(Math.random() * (50 + 50)) - 50;
                let positionY = Math.floor(Math.random() * 11);
                let positionZ = Math.floor(Math.random() * (50 + 50)) - 50;
                cube2.position.set(positionX, positionY, positionZ);
                cube2.castShadow = true;
                cube2.receiveShadow = true;
                cube2.name = "MultiMaterial";
                scene.add(cube2)
                cubes.push(cube2)                
            }
            
            break;
        default:
            for (let i = 0; i < scene.children.length; i++) {
                if (scene.children[i].name === "MultiMaterial") {                                        
                    scene.remove(scene.children[i]);
                }
            }
            // scene.traverse(function (child) {
            //     if (child instanceof THREE.Mesh && child.name === "MultiMaterial") {
            //         console.log(child instanceof THREE.Mesh);
            //         scene.remove(child);
            //     }
            // });
            for (let i = 0; i < cubes.length; i++) {
                const color = new THREE.Color(0xffffff);
                color.setRGB(Math.random(), Math.random(), Math.random());
                cubes[i].material = new THREE.MeshBasicMaterial({
                    color: color
                });
                cubes[i].visible = true;
            }
            break;
    }
    renderer.render(scene, camera);
}