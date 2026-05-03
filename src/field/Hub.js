import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { HUB, FIELD } from './FieldDimensions.js';

function buildSingleHub(scene, world, x, color) {
  const W = HUB.WIDTH;
  const D = HUB.DEPTH;
  const H = HUB.HEIGHT;
  const WALL = 0.05;

  // Hub body — hollow box (4 walls + floor, open top)
  const positions = [
    { w: W,    h: H,    d: WALL, x: 0,       y: H/2,  z:  D/2 }, // front
    { w: W,    h: H,    d: WALL, x: 0,       y: H/2,  z: -D/2 }, // back
    { w: WALL, h: H,    d: D,    x:  W/2,    y: H/2,  z: 0    }, // right
    { w: WALL, h: H,    d: D,    x: -W/2,    y: H/2,  z: 0    }, // left
    { w: W,    h: WALL, d: D,    x: 0,       y: WALL, z: 0    }, // floor
  ];

  const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 0.8 });

  positions.forEach(p => {
    const geo = new THREE.BoxGeometry(p.w, p.h, p.d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + p.x, p.y, p.z);
    mesh.castShadow = true;
    scene.add(mesh);

    const body = new CANNON.Body({ mass: 0 });
    body.addShape(new CANNON.Box(new CANNON.Vec3(p.w/2, p.h/2, p.d/2)));
    body.position.set(x + p.x, p.y, p.z);
    world.addBody(body);
  });
}

export function buildHubs(scene, world) {
  const redX  =  FIELD.WIDTH / 2 - HUB.DIST_FROM_WALL;
  const blueX = -FIELD.WIDTH / 2 + HUB.DIST_FROM_WALL;
  buildSingleHub(scene, world, redX,  0xff6666);
  buildSingleHub(scene, world, blueX, 0x6666ff);
}