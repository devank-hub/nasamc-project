import http from 'http';
import 'dotenv/config'; /* setting config in .env file apply to all below files 
    --see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import */

import { app } from './app.js';
import { mongoConnect } from './utils/services/mongo.js';
import { loadPlanetsData } from './models/planets.model.js';
import { loadLaunchdata } from './models/launches.model.js';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

//to use await for mongoConnect and loadPlanetsData
async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchdata();
    
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    })
}

startServer();