import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function makeBox(scene, world, {
  w, h, d,
  position = [0, 0, 0],
  color = 0x888888,
  mass = 0,
  visible = true,
}) {
  // Three.js mesh
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (visible) scene.add(mesh);

  // Cannon-es body
  const shape = new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2));
  const body = new CANNON.Body({ mass });
  body.addShape(shape);
  body.position.set(...position);
  world.addBody(body);

  return { mesh, body };
}

export function makeCylinder(scene, world, {
  radius, height,
  position = [0, 0, 0],
  color = 0x888888,
  mass = 0,
}) {
  const geo = new THREE.CylinderGeometry(radius, radius, height, 16);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...position);
  mesh.castShadow = true;
  scene.add(mesh);

  const shape = new CANNON.Cylinder(radius, radius, height, 16);
  const body = new CANNON.Body({ mass });
  body.addShape(shape);
  body.position.set(...position);
  world.addBody(body);

  return { mesh, body };
}

// Sync Three.js mesh to Cannon body each frame
export function syncMeshToBody(mesh, body) {
  mesh.position.copy(body.position);
  mesh.quaternion.copy(body.quaternion);
}