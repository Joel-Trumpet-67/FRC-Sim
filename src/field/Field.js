import { buildCarpet }     from './Carpet.js';
import { buildGuardrails } from './Guardrails.js';
import { buildBumps }      from './Bump.js';
import { buildHubs }       from './Hub.js';
import { buildTowers }     from './Tower.js';
import { buildTrenches }   from './Trench.js';

export function buildField(scene, world) {
  buildCarpet(scene, world);
  buildGuardrails(scene, world);
  buildBumps(scene, world);
  buildHubs(scene, world);
  buildTowers(scene, world);
  buildTrenches(scene, world);
}