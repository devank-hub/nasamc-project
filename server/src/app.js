import path from 'path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

//importing api calls from the file
import { api } from './routes/api.js';

// defining the __dirname using url module and path.dirname()
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(path.dirname(import.meta.url));

const app = express();
//defining CORS for CORS rules in network tab
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..','public')));

//api versioning
app.use('/v1', api);

app.get('/*',(req, res)=>{
    res.sendFile(path.join(__dirname, '..','public','index.html'));
});

export { app };