import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
import { Color } from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Constants
const backgroundColor = 0x333333;
const fogColor = 0xDFE9F3;
const fogNear = 50;
const fogFar = 300;
const initialFogDensity = 50;

// Scene
const scene = new THREE.Scene();
scene.background = new Color(backgroundColor);
scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

// Fog slider
const fogSlider = document.getElementById("fog-slider");
fogSlider.value = initialFogDensity;

fogSlider.addEventListener("input", () => {
    const newFogStrength = parseFloat(fogSlider.value);
    updateFogStrength(newFogStrength);
    console.log("strength: " + newFogStrength);
});

function updateFogStrength(newFogStrength) {
    scene.fog.density = newFogStrength;
    renderer.render(scene, camera);
}

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);

// Control
//const controls = new OrbitControls ( camera, renderer.domElement);

camera.position.set(10, 10, 100);
//controls.update();

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Light
const pointLight = new THREE.PointLight(0xffffff, 0.2);
pointLight.position.set(0, 0, -70);
pointLight.castShadow = true;
scene.add(pointLight);

// Brown plane
const geometryPlane = new THREE.BoxGeometry(100, 1, 100);
const materialPlane = new THREE.MeshPhongMaterial({ color: 0xBC8842 });
const plane = new THREE.Mesh(geometryPlane, materialPlane);
plane.position.set(0, -25, -70);
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);

// Yellow Cone 
const geometryCone = new THREE.ConeGeometry(10, 3, 16, 100);
const materialCone = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
const cone = new THREE.Mesh(geometryCone, materialCone);
cone.position.set(0, 30, -100);
cone.castShadow = true;
cone.receiveShadow = true;
scene.add(cone);

// Blue Sphere 

const geometrySphere = new THREE.SphereGeometry(15, 32, 16);
const materialSphere = new THREE.MeshPhongMaterial({ color: 0x4682B4 });
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
sphere.position.set(10, -10, 20);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// Yellow torus
const geometryTorus = new THREE.TorusGeometry(10, 3, 16, 100);
const materialTorus = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
const torus = new THREE.Mesh(geometryTorus, materialTorus);
torus.position.set(0, 20, -50);
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);

// Update on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial rendering
renderer.render(scene, camera);

const keyboardState = {};
document.addEventListener('keydown', (event) => {
    keyboardState[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keyboardState[event.code] = false;
});

function handleKeyboardInput() {
    const speed = 2;

    if (keyboardState['KeyW']) {
        camera.position.z -= speed;
    }
    if (keyboardState['KeyS']) {
        camera.position.z += speed;
    }
    if (keyboardState['KeyA']) {
        camera.position.x -= speed;
    }
    if (keyboardState['KeyD']) {
        camera.position.x += speed;
    }

    // Update the camera's look-at position to always face the center of the scene
    camera.lookAt(scene.position);
}

// ...

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Handle keyboard input
    handleKeyboardInput();

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation/render loop
animate();