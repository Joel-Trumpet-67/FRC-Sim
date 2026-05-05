import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { config } from './RobotConfig.js';
import { bumperMaterial } from '../physics/Materials.js';

const loader = new STLLoader();
const SCALE = 0.001; // mm to meters

export function buildChassis(scene, world, startPosition = [0, 0.15, 0]) {
  const [sx, sy, sz] = startPosition;

  // Physics body — box approximation of robot
  const body = new CANNON.Body({ mass: config.mass, material: bumperMaterial });
  const chassisShape = new CANNON.Box(new CANNON.Vec3(
    0.43,  // half of 857mm depth
    0.33,  // half height ~660mm
    0.40,  // half of 791mm width
  ));
  body.addShape(chassisShape);
  body.position.set(sx, sy + 0.33, sz);
  body.linearDamping  = config.linearDamping;
  body.angularDamping = config.angularDamping;
  world.addBody(body);

  // Visual group
  const group = new THREE.Group();

  // Load STL visual
  loader.load('/models/robot.stl', (geometry) => {
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    const mat = new THREE.MeshStandardMaterial({
      color: 0x4488cc,
      roughness: 0.4,
      metalness: 0.7,
    });

    const mesh = new THREE.Mesh(geometry, mat);
    mesh.scale.setScalar(SCALE);

    // Center geometry on X and Z, sit on ground on Y
    mesh.position.set(0, -0.33, 0);
    mesh.rotation.y = Math.PI / 2;
    mesh.castShadow = true;
    group.add(mesh);
  });

  scene.add(group);
  return { body, group };
}