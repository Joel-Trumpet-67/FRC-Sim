import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { buildField }            from './field/Field.js';
import { buildChassis }          from './robots/Chassis.js';
import { applyDrive }            from './robots/DriveSystem.js';
import { getDriveInputs, getGamepadInputs } from './core/InputManager.js';
import { registerContactMaterials }         from './physics/Materials.js';
import { CameraController }      from './camera/CameraController.js';
import { FIELD }                 from './field/FieldDimensions.js';

// ── Renderer ──────────────────────────────────────────────
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

// ── Scene & Camera ────────────────────────────────────────
const scene  = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
scene.fog = new THREE.Fog(0x1a1a2e, 20, 60);

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.01, 200
);
camera.position.set(0, 10, 10);

const camController = new CameraController(camera, renderer.domElement);

// ── Lighting ──────────────────────────────────────────────
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(5, 15, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left   = -FIELD.WIDTH / 2;
sun.shadow.camera.right  =  FIELD.WIDTH / 2;
sun.shadow.camera.top    =  FIELD.DEPTH / 2;
sun.shadow.camera.bottom = -FIELD.DEPTH / 2;
scene.add(sun);

// ── Physics ───────────────────────────────────────────────
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
registerContactMaterials(world);

// ── Field ─────────────────────────────────────────────────
buildField(scene, world);

// ── Robot ─────────────────────────────────────────────────
// Spawn on red alliance side, facing field center
const { body: robotBody, group: robotGroup } = buildChassis(
  scene, world, [FIELD.WIDTH / 2 - 1.5, 0.25, 0]
);

// ── Game Loop ─────────────────────────────────────────────
const FIXED_STEP  = 1 / 60;
const MAX_SUBSTEP = 3;
let lastTime = performance.now();

function loop() {
  requestAnimationFrame(loop);

  const now   = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime    = now;

  // Input
  const gp     = getGamepadInputs();
  const kb     = getDriveInputs();
  const input  = gp ?? kb;
  applyDrive(robotBody, input.left, input.right);

  // Physics step
  world.step(FIXED_STEP, delta, MAX_SUBSTEP);

  // Sync robot visual to physics body
  robotGroup.position.copy(robotBody.position);
  robotGroup.quaternion.copy(robotBody.quaternion);

  // Camera
  camController.followTarget(robotBody.position);
  camController.update();

  renderer.render(scene, camera);
}

loop();