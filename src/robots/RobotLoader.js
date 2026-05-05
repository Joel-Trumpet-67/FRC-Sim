import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { bumperMaterial } from '../physics/Materials.js';

const gltfLoader = new GLTFLoader();

export class RobotLoader {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.group = new THREE.Group();
    this.body = null;
    this.parts = {};
    this.controls = {};
    this.config = null;
    this.onPartLoaded = null;
    scene.add(this.group);
  }

  async pickRobotFolder() {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const files = {};
      for await (const [name, handle] of dirHandle) {
        if (name.endsWith('.gltf') || name.endsWith('.glb') || name.endsWith('.json')) {
          files[name] = handle;
        }
      }
      return { dirHandle, files };
    } catch (e) {
      console.warn('Folder picker cancelled');
      return null;
    }
  }

  async loadFromFolder(dirHandle, files, position = [0, 0.5, 0]) {
    let config = null;

    if (files['robot.json']) {
      const file = await files['robot.json'].getFile();
      const text = await file.text();
      config = JSON.parse(text);
    } else {
      config = {
        name: 'Custom Robot',
        mass: 52.2,
        scale: 0.001,
        parts: Object.keys(files)
          .filter(f => f.endsWith('.gltf') || f.endsWith('.glb'))
          .map(f => ({
            name: f.replace('.gltf', '').replace('.glb', ''),
            file: f,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
          }))
      };
    }

    this.config = config;
    const scale = config.scale || 0.001;

    // Create physics body
    this.body = new CANNON.Body({
      mass: config.mass || 52.2,
      material: bumperMaterial,
      linearDamping: 0.8,
      angularDamping: 0.95,
    });
    this.body.addShape(new CANNON.Box(new CANNON.Vec3(0.43, 0.35, 0.40)));
    this.body.position.set(...position);
    this.world.addBody(this.body);

    // Load parts one at a time so progress bar updates
    for (const part of config.parts) {
      await this.loadPartFromHandle(part, files[part.file], scale);
      if (this.onPartLoaded) this.onPartLoaded(part.name);
    }

    return this;
  }

  loadPartFromHandle(partConfig, fileHandle, scale) {
    if (!fileHandle) {
      console.warn(`File not found: ${partConfig.file}`);
      return Promise.resolve();
    }

    return new Promise(async (resolve) => {
      try {
        const file = await fileHandle.getFile();
        const arrayBuffer = await file.arrayBuffer();

        gltfLoader.parse(arrayBuffer, '', (gltf) => {
          const partGroup = gltf.scene;
          partGroup.scale.setScalar(scale);
          partGroup.name = partConfig.name;

          if (partConfig.color) {
            partGroup.traverse(child => {
              if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                  color: partConfig.color,
                  roughness: 0.6,
                  metalness: 0.4,
                });
              }
            });
          }

          partGroup.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          this.parts[partConfig.name] = {
            group: partGroup,
            config: partConfig,
            currentAngle: 0,
            currentPos: 0,
          };

          if (partConfig.control) {
            this.controls[partConfig.control] = partConfig.name;
          }

          this.group.add(partGroup);
          resolve();
        }, (err) => {
          console.warn(`Failed to parse ${partConfig.file}:`, err);
          resolve();
        });
      } catch (err) {
        console.warn(`Failed to load ${partConfig.file}:`, err);
        resolve();
      }
    });
  }

  update(mechanismInputs = {}) {
    if (!this.body) return;

    this.group.position.copy(this.body.position);
    this.group.quaternion.copy(this.body.quaternion);

    for (const [control, partName] of Object.entries(this.controls)) {
      const part = this.parts[partName];
      if (!part) continue;
      const config = part.config;
      const input = mechanismInputs[control] || 0;

      if (config.joint === 'hinge') {
        const speed = 0.02;
        part.currentAngle += input * speed;
        part.currentAngle = Math.max(
          (config.minAngle || 0) * Math.PI / 180,
          Math.min((config.maxAngle || 90) * Math.PI / 180, part.currentAngle)
        );
        const axis = config.axis || [0, 0, 1];
        part.group.rotation.set(
          axis[0] * part.currentAngle,
          axis[1] * part.currentAngle,
          axis[2] * part.currentAngle,
        );
      }

      if (config.joint === 'slider') {
        const speed = 0.01;
        part.currentPos += input * speed;
        part.currentPos = Math.max(
          config.minPos || 0,
          Math.min(config.maxPos || 1, part.currentPos)
        );
        const axis = config.axis || [0, 1, 0];
        part.group.position.set(
          axis[0] * part.currentPos,
          axis[1] * part.currentPos,
          axis[2] * part.currentPos,
        );
      }
    }
  }

  remove() {
    if (this.body) this.world.removeBody(this.body);
    this.scene.remove(this.group);
  }
}