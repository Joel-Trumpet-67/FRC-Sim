import * as CANNON from 'cannon-es';

export const carpetMaterial    = new CANNON.Material('carpet');
export const bumperMaterial    = new CANNON.Material('bumper');
export const fieldWallMaterial = new CANNON.Material('fieldWall');
export const wheelMaterial     = new CANNON.Material('wheel');

export function registerContactMaterials(world) {
  // Wheel on carpet — high friction, no bounce
  world.addContactMaterial(new CANNON.ContactMaterial(
    wheelMaterial, carpetMaterial,
    { friction: 0.85, restitution: 0.0 }
  ));

  // Bumper on bumper/wall — medium friction, slight bounce
  world.addContactMaterial(new CANNON.ContactMaterial(
    bumperMaterial, fieldWallMaterial,
    { friction: 0.4, restitution: 0.15 }
  ));

  world.addContactMaterial(new CANNON.ContactMaterial(
    bumperMaterial, bumperMaterial,
    { friction: 0.5, restitution: 0.2 }
  ));
}