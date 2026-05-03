import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

const loader = new STLLoader();
const SCALE = 0.02691;

const PART_COLORS = {
  // Hub body — the main tall black scoring box at center
  hub_body_red:     { color: 0x080808, roughness: 0.3, metalness: 0.7 },
  hub_body_blue:    { color: 0x080808, roughness: 0.3, metalness: 0.7 },
  // Hub chute — the outpost near alliance wall, dark gray
  hub_chute_red:    { color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 },
  hub_chute_blue:   { color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 },
  // Bumps — HDPE plastic, visible alliance colors
  bump_red:         { color: 0xcc2200, roughness: 0.8, metalness: 0.0 },
  bump_blue:        { color: 0x0022cc, roughness: 0.8, metalness: 0.0 },
  // Tower — bright silver aluminum
  tower_rail_1:     { color: 0xe0e0e0, roughness: 0.1, metalness: 0.95 },
  tower_rail_2:     { color: 0xe0e0e0, roughness: 0.1, metalness: 0.95 },
  tower_rail_3:     { color: 0xe0e0e0, roughness: 0.1, metalness: 0.95 },
  tower_rail_4:     { color: 0xe0e0e0, roughness: 0.1, metalness: 0.95 },
  tower_rail_5:     { color: 0xe0e0e0, roughness: 0.1, metalness: 0.95 },
  tower_rail_6:     { color: 0xe0e0e0, roughness: 0.1, metalness: 0.95 },
  tower_brace_red:  { color: 0xcccccc, roughness: 0.15, metalness: 0.9 },
  tower_brace_blue: { color: 0xcccccc, roughness: 0.15, metalness: 0.9 },
  // Trench — silver aluminum extrusion
  trench_box_1:     { color: 0x999999, roughness: 0.25, metalness: 0.85 },
  trench_box_2:     { color: 0x999999, roughness: 0.25, metalness: 0.85 },
  trench_arm_1:     { color: 0xbbbbbb, roughness: 0.15, metalness: 0.9 },
  trench_arm_2:     { color: 0xbbbbbb, roughness: 0.15, metalness: 0.9 },
  trench_arm_3:     { color: 0xbbbbbb, roughness: 0.15, metalness: 0.9 },
  trench_arm_4:     { color: 0xbbbbbb, roughness: 0.15, metalness: 0.9 },
  // Depot — dark gray metal structure
  depot_post_1:     { color: 0x2a2a2a, roughness: 0.5, metalness: 0.7 },
  depot_post_2:     { color: 0x2a2a2a, roughness: 0.5, metalness: 0.7 },
  depot_post_3:     { color: 0x2a2a2a, roughness: 0.5, metalness: 0.7 },
  depot_post_4:     { color: 0x2a2a2a, roughness: 0.5, metalness: 0.7 },
  depot_post_5:     { color: 0x2a2a2a, roughness: 0.5, metalness: 0.7 },
  depot_post_6:     { color: 0x2a2a2a, roughness: 0.5, metalness: 0.7 },
  // Hardware — dark metal bolts/screws
  hardware_1:       { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  hardware_2:       { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  hardware_3:       { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  hardware_4:       { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  hardware_5:       { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  hardware_6:       { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  hardware_7:       { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  hardware_8:       { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  hardware_9:       { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  hardware_10:      { color: 0x181818, roughness: 0.3, metalness: 0.9 },
  flat_plate_1:     { color: 0x333333, roughness: 0.5, metalness: 0.6 },
  flat_plate_2:     { color: 0x333333, roughness: 0.5, metalness: 0.6 },
};

function loadPart(name, fieldGroup) {
  const { color, roughness, metalness } = PART_COLORS[name];
  const mat = new THREE.MeshStandardMaterial({
    color, roughness, metalness, side: THREE.DoubleSide
  });

  return new Promise((resolve) => {
    loader.load(`/models/${name}.stl`, (geometry) => {
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      fieldGroup.add(mesh);
      resolve(mesh);
    });
  });
}

export async function buildFieldModels(scene) {
  const fieldGroup = new THREE.Group();

  await Promise.all(Object.keys(PART_COLORS).map(name => loadPart(name, fieldGroup)));

  fieldGroup.scale.setScalar(SCALE);
  fieldGroup.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
  fieldGroup.position.set(0, 0, 0);
  scene.add(fieldGroup);

  // Hub glow from inside — positioned at hub center heights
  // hub_body centers at game y=1.91m, we put light at 1.5m inside
  const redHubLight = new THREE.PointLight(0xff3300, 4, 3);
  redHubLight.position.set(-2.87, 1.5, 0);
  scene.add(redHubLight);

  const blueHubLight = new THREE.PointLight(0x0033ff, 4, 3);
  blueHubLight.position.set(2.87, 1.5, 0);
  scene.add(blueHubLight);

  // Blue LED strip under blue depot/outpost like XRC
  const blueLED = new THREE.PointLight(0x0066ff, 2, 4);
  blueLED.position.set(7.84, 0.3, 0);
  scene.add(blueLED);

  const redLED = new THREE.PointLight(0xff3300, 2, 4);
  redLED.position.set(-7.84, 0.3, 0);
  scene.add(redLED);
}