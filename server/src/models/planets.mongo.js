import mongoose from "mongoose";

const planetsSchema = new mongoose.Schema({
    kepler_name: {
        type: String,
        required: true
    }
});

const planets = mongoose.model("Planet", planetsSchema);

export{ planets };