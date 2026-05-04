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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06060e);
scene.fog = new THREE.FogExp2(0x06060e, 0.01);

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.01, 200
);
camera.position.set(0, 20, 18);

const camController = new CameraController(camera, renderer.domElement);

// Arena ceiling
const ceilingGeo = new THREE.PlaneGeometry(60, 60);
const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x06060e, roughness: 1.0 });
const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 12;
scene.add(ceiling);

// Arena walls
[-1, 1].forEach(side => {
  const wallGeo = new THREE.PlaneGeometry(FIELD.WIDTH + 10, 14);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x08080f, roughness: 1.0 });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(0, 6, side * (FIELD.DEPTH/2 + 4));
  wall.rotation.y = side > 0 ? Math.PI : 0;
  scene.add(wall);
});

[-1, 1].forEach(side => {
  const wallGeo = new THREE.PlaneGeometry(FIELD.DEPTH + 10, 14);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x08080f, roughness: 1.0 });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(side * (FIELD.WIDTH/2 + 4), 6, 0);
  wall.rotation.y = side > 0 ? -Math.PI/2 : Math.PI/2;
  scene.add(wall);
});

// Ambient
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// Overhead lighting rigs
const rigPositions = [
  [-FIELD.WIDTH/3, -FIELD.DEPTH/3],
  [0,              -FIELD.DEPTH/3],
  [FIELD.WIDTH/3,  -FIELD.DEPTH/3],
  [-FIELD.WIDTH/3,  0            ],
  [0,               0            ],
  [FIELD.WIDTH/3,   0            ],
  [-FIELD.WIDTH/3,  FIELD.DEPTH/3],
  [0,               FIELD.DEPTH/3],
  [FIELD.WIDTH/3,   FIELD.DEPTH/3],
];

rigPositions.forEach(([x, z]) => {
  const light = new THREE.SpotLight(0xffffff, 150, 22, Math.PI / 5, 0.5);
  light.position.set(x, 11, z);
  light.target.position.set(x, 0, z);
  light.castShadow = true;
  light.shadow.mapSize.set(512, 512);
  scene.add(light);
  scene.add(light.target);

  const barGeo = new THREE.BoxGeometry(1.5, 0.06, 0.06);
  const barMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
  const bar = new THREE.Mesh(barGeo, barMat);
  bar.position.set(x, 10.97, z);
  scene.add(bar);
});

// Physics
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
registerContactMaterials(world);

let robotBody, robotGroup;

const FIXED_STEP  = 1 / 60;
const MAX_SUBSTEP = 3;
let lastTime = performance.now();

function loop() {
  requestAnimationFrame(loop);
  const now   = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime    = now;

  const gp    = getGamepadInputs();
  const kb    = getDriveInputs();
  const input = gp ?? kb;
  applyDrive(robotBody, input.left, input.right);

  world.step(FIXED_STEP, delta, MAX_SUBSTEP);

  robotGroup.position.copy(robotBody.position);
  robotGroup.quaternion.copy(robotBody.quaternion);

  camController.followTarget(robotBody.position);
  camController.update();

  renderer.render(scene, camera);
}

async function init() {
  await buildField(scene, world);
  const chassis = buildChassis(scene, world, [-3.5, 0.25, 0]);
  robotBody  = chassis.body;
  robotGroup = chassis.group;
  loop();
}

init();