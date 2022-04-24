import { getAllPlanets } from '../../models/planets.model.js';

async function httpGetAllPlanets(req, res){
    return res.status(200).json(await getAllPlanets());
}

export{ httpGetAllPlanets };