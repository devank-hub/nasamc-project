import mongoose from 'mongoose';
import 'dotenv/config'; // defining fro tests to pass the mongoose connection

const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL)
async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

mongoose.connection.on('open', () => {
    console.log('MongoDB Connection is ready')
})

async function mongoDisconnect() {
    await mongoose.connection.close();
}

export { mongoConnect, mongoDisconnect };