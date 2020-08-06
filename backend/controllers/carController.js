import mongoose from 'mongoose';
import { CarSchema } from '../models/carModel';

const Car = mongoose.model('Car', CarSchema);

export const addNewCar = (req, res) => {
    let newCar = new Car(req.body);

    newCar.save((err, Car) => {
        if (err) {
            rest.send(err);
        }
        res.json(Car);
    });
};