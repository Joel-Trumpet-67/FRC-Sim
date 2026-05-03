import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { FIELD, HUB } from './FieldDimensions.js';

const loader = new STLLoader();
const SCALE = 0.004;

function loadSTL(path, color, scene, position, rotation = [0, 0, 0]) {
  return new Promise((resolve) => {
    loader.load(path, (geometry) => {
      geometry.computeVertexNormals();
      const mat = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.scale.setScalar(SCALE);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      resolve(mesh);
    });
  });
}

export async function buildFieldModels(scene) {
  const redX  =  FIELD.WIDTH / 2 - HUB.DIST_FROM_WALL;
  const blueX = -FIELD.WIDTH / 2 + HUB.DIST_FROM_WALL;

  await Promise.all([
    // Red hub
    loadSTL('/models/small-scale-rebuilt-field-base.stl',    0x444444, scene, [redX, 0, 0]),
    loadSTL('/models/small-scale-rebuilt-field-hexgoal.stl', 0xff4444, scene, [redX, 0, 0]),

    // Blue hub
    loadSTL('/models/small-scale-rebuilt-field-base.stl',    0x444444, scene, [blueX, 0, 0], [0, Math.PI, 0]),
    loadSTL('/models/small-scale-rebuilt-field-hexgoal.stl', 0x4444ff, scene, [blueX, 0, 0], [0, Math.PI, 0]),

    // Red bumps
    loadSTL('/models/small-scale-rebuilt-field-bump.stl',       0xff6600, scene, [redX, 0,  0.93]),
    loadSTL('/models/small-scale-rebuilt-field-bump.stl',       0xff6600, scene, [redX, 0, -0.93], [0, Math.PI, 0]),
    loadSTL('/models/small-scale-rebuilt-field-bumptrench.stl', 0xcccccc, scene, [redX, 0,  0.93]),
    loadSTL('/models/small-scale-rebuilt-field-bumptrench.stl', 0xcccccc, scene, [redX, 0, -0.93], [0, Math.PI, 0]),

    // Blue bumps
    loadSTL('/models/small-scale-rebuilt-field-bump.stl',       0x0066ff, scene, [blueX, 0,  0.93], [0, Math.PI, 0]),
    loadSTL('/models/small-scale-rebuilt-field-bump.stl',       0x0066ff, scene, [blueX, 0, -0.93]),
    loadSTL('/models/small-scale-rebuilt-field-bumptrench.stl', 0xcccccc, scene, [blueX, 0,  0.93], [0, Math.PI, 0]),
    loadSTL('/models/small-scale-rebuilt-field-bumptrench.stl', 0xcccccc, scene, [blueX, 0, -0.93]),

    // Red tower
    loadSTL('/models/small-scape-rebuilt-field-upright.stl', 0x888888, scene, [FIELD.WIDTH/2 - 0.6, 0,  0.6]),
    loadSTL('/models/small-scape-rebuilt-field-upright.stl', 0x888888, scene, [FIELD.WIDTH/2 - 0.6, 0, -0.6]),
    loadSTL('/models/small-scape-rebuilt-field-rung.stl',    0xaaaaaa, scene, [FIELD.WIDTH/2 - 0.6, 0,  0]),

    // Blue tower
    loadSTL('/models/small-scape-rebuilt-field-upright.stl', 0x888888, scene, [-FIELD.WIDTH/2 + 0.6, 0,  0.6], [0, Math.PI, 0]),
    loadSTL('/models/small-scape-rebuilt-field-upright.stl', 0x888888, scene, [-FIELD.WIDTH/2 + 0.6, 0, -0.6], [0, Math.PI, 0]),
    loadSTL('/models/small-scape-rebuilt-field-rung.stl',    0xaaaaaa, scene, [-FIELD.WIDTH/2 + 0.6, 0,  0], [0, Math.PI, 0]),
  ]);
}