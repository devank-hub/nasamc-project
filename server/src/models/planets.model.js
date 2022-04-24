import path from 'path';
import * as fs from 'fs';
import * as parse from 'csv-parse';

// importing database schema and model
import { planets } from './planets.mongo.js';

// defining the __dirname using url module and path.dirname()
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(path.dirname(import.meta.url));

function isHabitable(planets) {
    return planets['koi_disposition'] === 'CONFIRMED' && 
    planets['koi_insol'] < 1.11 && planets['koi_insol'] > 0.36 && 
    planets['koi_prad'] <1.6;
}

function loadPlanetsData(){
    return new Promise((resolve,reject) => {
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
            .pipe(parse.parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if(isHabitable(data)){
                    savePlanet(data);
                }
            })
            .on('error', (err)=>{
                console.log(err);
                reject(err);
            })
            .on('end',async () => {
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`${countPlanetsFound} habitable planets found!`);
                resolve();
            });
        }
    );
}

// passing '_v' and '_id' to exclude from the response
async function getAllPlanets(){
    return await planets.find({}, {
        '_v': 0,
        '_id': 0,
    });
}

async function savePlanet(planet){
    // add the data to the database (upsert = insert + update)
    await planets.updateOne({
        kepler_name: planet.kepler_name,
    }, {
        kepler_name: planet.kepler_name,
    }, {
        upsert: true,
    });
}

export{ 
    loadPlanetsData,
    getAllPlanets,
};