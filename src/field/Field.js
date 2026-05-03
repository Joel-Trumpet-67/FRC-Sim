import { buildCarpet }      from './Carpet.js';
import { buildGuardrails }  from './Guardrails.js';
import { buildFieldModels } from './FieldModels.js';
import { buildFuelBalls }   from './FuelBalls.js';

export async function buildField(scene, world) {
  buildCarpet(scene, world);
  await buildFieldModels(scene);
  const syncFuelBalls = buildFuelBalls(scene, world);
  return { syncFuelBalls };
}