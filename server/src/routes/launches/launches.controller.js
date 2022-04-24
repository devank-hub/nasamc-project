import { getAllLaunches, scheduleNewLaunch, existLaunchWithId, abortLaunchById } from '../../models/launches.model.js';
import { getPagination } from '../../utils/services/query.js';

async function httpGetAllLaunches(req, res){
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunches(req, res){
    const launch = req.body;

    if(!launch.mission){
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Please provide mission'
        });
    }
    
    if(!launch.rocket){
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Please provide rocket name'
        });
    }

    if(!launch.launchDate){
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Please provide launch date'
        });
    }

    if(!launch.target){
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Please provide destination name'
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Please provide valid launch date'
        });
    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res){
    const launchId = +req.params.id;
    const existsLaunch = await existLaunchWithId(launchId);
    if(!existsLaunch){
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Launch Not found'
        });
    }
    const aborted = await abortLaunchById(launchId);
    if(!aborted){
        return res.status(404).json({
            error: 'Launch not aborted'
        });
    }
    return res.status(200).json({
        ok: true,
    });
}

export{ 
    httpGetAllLaunches,
    httpAddNewLaunches, 
    httpAbortLaunch,
};