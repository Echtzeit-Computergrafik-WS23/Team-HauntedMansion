import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
import { Vector3 } from '../node_modules/three/src/math/Vector3.js';
//import {CSS3DRenderer} from 'three/addons/renderers/CSS2DRenderer.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

//Color of Line
const material = new THREE.LineBasicMaterial({ color: 0x5B82FA });
const points = [];
points.push(new Vector3( -10, 0, 0));
points.push(new Vector3( 0, 10, 0));
points.push(new Vector3( 10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry,material);
scene.add(line);
renderer.render(scene,camera);

// function animate() {
//     requestAnimationFrame(animate);
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     renderer.render(scene, camera);
// }
// animate();

// const canvas = document.getElementById("canvas");
// const gl = canvas.getContext("webgl2");
// if (!gl){
//     alert("Browser does not support gl");
// }
// // Set the color of the canvas.
// // Parameters are RGB colors (red, green, blue, alpha)
// gl.clearColor(1.0, 0.0, 0.0, 1.0);

// //Clear color buffer
// gl.clear(gl.COLOR_BUFFER_BIT);