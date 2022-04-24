import axios from 'axios';

import { launches } from './launches.mongo.js';
import { planets } from './planets.mongo.js';

const DFAULT_FLIGHT_NUMBER = 1;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function loadLaunchdata(){
    console.log('Downloading launch data...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate:[
                {
                    path:'rocket',
                    select:{
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1,
                    }
                }
            ]
        }
    });

    if (response.status != 200) {
        console.log('Error downloading launch data');
        throw new Error('Error downloading launch data');
    }

    const launchDocs = response.data.docs;
    for ( const launchDoc of launchDocs ){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });
        const launch = {
            flightNumber:launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }
        await saveLaunch(launch);
    }
}

async function findLaunch(filter){
    return await launches.findOne(filter);
}

async function existLaunchWithId(launchId){
    return await findLaunch({flightNumber: launchId,});
}

async function getLatestFlightNumber(){
    const latestLaunch = await launches
        .findOne({})
        .sort('-flightNumber'); // - sign for descending order

    if(!latestLaunch){
        return DFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

// '_id' and '__v' are automatically added by mongoose, so to remove them from the response
async function getAllLaunches(skip, limit) {
    return await launches
    .find({}, { '_id': 0, '__v': 0 })
    .sort({ flightNumber: 1 }) // for ascending order
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch){
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
        },
        launch,
        {
            upsert: true,
        }
    );
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({kepler_name: launch.target});
    if(!planet){
        throw new Error('Planet not found');
    }
    const newFlightNumber = await getLatestFlightNumber()+1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['zero to mastery', 'nasa'],
        flightNumber: newFlightNumber,
    });
    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
    const aborted = await launches.updateOne({
        flightNumber: launchId,
    },{
        upcoming: false,
        success: false,
    });
    return aborted.modifiedCount === 1;;
}

export{
    loadLaunchdata,
    existLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
}