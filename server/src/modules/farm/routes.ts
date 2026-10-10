import { Router } from 'express';
import type { FarmOptionsResponse, FarmResponse } from '../../../../shared/contracts/farm';
import { makeMeta } from '../../http';
import { createFarm, getFarm, getFarmOptions, updateFarm } from './service';
import { validateFarm, validatePatch } from './validate';

export const farmRouter: Router = Router();

/** GET /api/farm/setup/options — dropdown data for the form. */
farmRouter.get('/setup/options', (_req, res) => {
  const payload: FarmOptionsResponse = { ...getFarmOptions(), meta: makeMeta() };
  res.json(payload);
});

/** GET /api/farm — the saved profile (null if not yet created). */
farmRouter.get('/', (_req, res) => {
  const payload: FarmResponse = { farm: getFarm(), meta: makeMeta() };
  res.json(payload);
});

/** POST /api/farm — create the profile. */
farmRouter.post('/', (req, res) => {
  const input = validateFarm(req.body, { partial: false });
  const farm = createFarm(input);
  const payload: FarmResponse = { farm, meta: makeMeta() };
  res.status(201).json(payload);
});

/** PATCH /api/farm — partial update (resave after editing the form). */
farmRouter.patch('/', (req, res) => {
  const patch = validatePatch(req.body);
  const farm = updateFarm(patch);
  const payload: FarmResponse = { farm, meta: makeMeta() };
  res.json(payload);
});
