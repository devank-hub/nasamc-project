import request from 'supertest';
import { app } from '../../app.js';
import { loadPlanetsData } from '../../models/planets.model.js';
import { mongoConnect, mongoDisconnect } from '../../utils/services/mongo.js';

describe('Launches RestAPI', () => {
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData(); // to make it pass the CI/CD pipeline as server is not triggering
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /v1/launches', () => {
        test('it should respond with 200 status code',async () => {
            await request(app)
                .get('/v1/launches')
                .expect('content-type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /v1/launch', () => {
        const completeDate = {
            mission: 'ISS Test1',
            rocket: 'NCC AGNI',
            target: 'Kepler-62 f',
            launchDate: 'January 15, 2030'
        };
        const launchDataWithoutDate = {
            mission: 'ISS Test1',
            rocket: 'NCC AGNI',
            target: 'Kepler-62 f'
        };
        const launchDataWithoutmission = {
            rocket: 'NCC AGNI',
            target: 'Kepler-62 f',
            launchDate: 'January 15, 2030'
        };
        const launchDataWithoutRocket = {
            mission: 'ISS Test1',
            target: 'Kepler-62 f',
            launchDate: 'January 15, 2030'
        };
        const launchDataWithoutTarget = {
            mission: 'ISS Test1',
            rocket: 'NCC AGNI',
            launchDate: 'January 15, 2030'
        };
        test('it should respond with 201 status code',async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeDate)
                .expect('content-type', /json/)
                .expect(201);
            const requiredDate = new Date(completeDate.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requiredDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test('it should catch missing date properties of the body',async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('content-type', /json/)
                .expect(400);
            expect(response.body);
        });
        test('it should catch missing mission properties of the body',async () => {
            const response_mission = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutmission)
                .expect('content-type', /json/)
                .expect(400);
            expect(response_mission.body);
        });
        test('it should catch missing rocket properties of the body',async () => {
            const response_rocket = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutRocket)
                .expect('content-type', /json/)
                .expect(400);
            expect(response_rocket.body);
        });
        test('it should catch missing target properties of the body',async () => {
            const response_target = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutTarget)
                .expect('content-type', /json/)
                .expect(400);
            expect(response_target.body);
        });
        const differentLaunchDatawithWrongdate = {
            mission: 'ISS Test1',
            rocket: 'NCC AGNI',
            target: 'Kepler-62 f',
            launchDate: 'hello'
        }
        test('it should catch invalid date format',async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(differentLaunchDatawithWrongdate)
                .expect('content-type', /json/)
                .expect(400);
            expect(response.body);
        });
    });    
})