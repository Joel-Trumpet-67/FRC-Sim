import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { buildField }            from './field/Field.js';
import { buildChassis }          from './robots/Chassis.js';
import { applyDrive }            from './robots/DriveSystem.js';
import { getDriveInputs, getGamepadInputs } from './core/InputManager.js';
import { registerContactMaterials }         from './physics/Materials.js';
import { CameraController }      from './camera/CameraController.js';
import { FIELD }                 from './field/FieldDimensions.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
scene.fog = new THREE.Fog(0x1a1a2e, 30, 80);

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.01, 200
);
camera.position.set(0, 12, 12);

const camController = new CameraController(camera, renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.position.set(0, 20, 0);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.camera.left   = -FIELD.WIDTH / 2;
sun.shadow.camera.right  =  FIELD.WIDTH / 2;
sun.shadow.camera.top    =  FIELD.DEPTH / 2;
sun.shadow.camera.bottom = -FIELD.DEPTH / 2;
scene.add(sun);

const redLight = new THREE.PointLight(0xff2200, 0.8, 10);
redLight.position.set(FIELD.WIDTH / 2 - 2, 3, 0);
scene.add(redLight);

const blueLight = new THREE.PointLight(0x0044ff, 0.8, 10);
blueLight.position.set(-FIELD.WIDTH / 2 + 2, 3, 0);
scene.add(blueLight);

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
registerContactMaterials(world);

let robotBody, robotGroup;

function loop() {
  requestAnimationFrame(loop);

  const now   = performance.now();
  const delta = Math.min((now - performance.now()) / 1000, 0.05);

  const gp    = getGamepadInputs();
  const kb    = getDriveInputs();
  const input = gp ?? kb;
  applyDrive(robotBody, input.left, input.right);

  world.step(1 / 60, delta, 3);

  robotGroup.position.copy(robotBody.position);
  robotGroup.quaternion.copy(robotBody.quaternion);

  camController.followTarget(robotBody.position);
  camController.update();

  renderer.render(scene, camera);
}

async function init() {
  await buildField(scene, world);

  const chassis = buildChassis(scene, world, [FIELD.WIDTH / 2 - 2, 0.25, 0]);
  robotBody  = chassis.body;
  robotGroup = chassis.group;

  loop();
}

init();