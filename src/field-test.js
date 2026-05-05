import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { buildField } from './field/Field.js';
import { registerContactMaterials } from './physics/Materials.js';
import { CameraController } from './camera/CameraController.js';
import { FIELD } from './field/FieldDimensions.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06060e);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 200);
camera.position.set(0, 20, 18);

const camController = new CameraController(camera, renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(0, 20, 0);
scene.add(sun);

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });
registerContactMaterials(world);

async function init() {
  await buildField(scene, world);

  function loop() {
    requestAnimationFrame(loop);
    camController.update();
    renderer.render(scene, camera);
  }
  loop();
}

init();