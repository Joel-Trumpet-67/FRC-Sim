import { buildCarpet }      from './Carpet.js';
import { buildFieldModels } from './FieldModels.js';

export async function buildField(scene, world) {
  buildCarpet(scene, world);
  await buildFieldModels(scene);
}