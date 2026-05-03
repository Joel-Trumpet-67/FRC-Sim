import { buildCarpet }      from './Carpet.js';
import { buildGuardrails }  from './Guardrails.js';
import { buildFieldModels } from './FieldModels.js';

export async function buildField(scene, world) {
  buildCarpet(scene, world);
  buildGuardrails(scene, world);
  await buildFieldModels(scene);
}