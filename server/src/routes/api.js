import express from 'express';

import { planetsRouter } from './planets/planets.router.js';
import { launchesRouter } from './launches/launches.router.js';

const api = express.Router();

api.use('/planets',planetsRouter);
api.use('/launches',launchesRouter); 

export { api };