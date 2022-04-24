import express from 'express';
import { httpGetAllLaunches, httpAddNewLaunches, httpAbortLaunch } from './launches.controller.js';

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunches);
launchesRouter.delete('/:id', httpAbortLaunch);

export{ launchesRouter };