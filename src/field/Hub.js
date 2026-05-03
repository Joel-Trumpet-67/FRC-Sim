import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { HUB, FIELD } from './FieldDimensions.js';

function buildSingleHub(scene, world, x, color) {
  const W = HUB.WIDTH;
  const D = HUB.DEPTH;
  const H = HUB.HEIGHT;
  const T = HUB.WALL;

  const mat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.7,
    metalness: 0.3,
  });

  const openingMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.2,
    emissive: color,
    emissiveIntensity: 0.3,
  });

  // Four walls
  const walls = [
    { w: W,    h: H,    d: T,    px: 0,    py: H/2, pz:  D/2 },
    { w: W,    h: H,    d: T,    px: 0,    py: H/2, pz: -D/2 },
    { w: T,    h: H,    d: D,    px:  W/2, py: H/2, pz: 0    },
    { w: T,    h: H,    d: D,    px: -W/2, py: H/2, pz: 0    },
    { w: W,    h: T,    d: D,    px: 0,    py: T/2, pz: 0    }, // floor
  ];

  walls.forEach(p => {
    const geo = new THREE.BoxGeometry(p.w, p.h, p.d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + p.px, p.py, p.pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const body = new CANNON.Body({ mass: 0 });
    body.addShape(new CANNON.Box(new CANNON.Vec3(p.w/2, p.h/2, p.d/2)));
    body.position.set(x + p.px, p.py, p.pz);
    world.addBody(body);
  });

  // Hexagonal opening on top — use cylinder as approximation
  const hexGeo = new THREE.CylinderGeometry(HUB.OPENING / 2, HUB.OPENING / 2, 0.05, 6);
  const hexMesh = new THREE.Mesh(hexGeo, openingMat);
  hexMesh.position.set(x, H + 0.025, 0);
  scene.add(hexMesh);

  // Alliance colored light above hub
  const light = new THREE.PointLight(color, 1.5, 4);
  light.position.set(x, H + 0.5, 0);
  scene.add(light);
}

export function buildHubs(scene, world) {
  const redX  =  FIELD.WIDTH / 2 - HUB.DIST_FROM_WALL;
  const blueX = -FIELD.WIDTH / 2 + HUB.DIST_FROM_WALL;
  buildSingleHub(scene, world, redX,  0xff2200);
  buildSingleHub(scene, world, blueX, 0x0044ff);
}