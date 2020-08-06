import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CarSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    year: {
        type: Date,
        required: true
    }
});