import mongoose from 'mongoose';
import { CarSchema } from '../models/carModel';

const Car = mongoose.model('Car', CarSchema);

export const addNewCar = (req, res) => {
    let newCar = new Car(req.body);

    newCar.save((err, Car) => {
        if (err) {
            res.send(err);
        }
        res.json(Car);
    });
};

export const getCars = (req, res) => {
    Car.find({}, (err, Car) => {
        if (err) {
            rest.send(err);
        }
        res.json(Car);
    });
};

export const getCarWithId = (req, res) => {
    Car.findById(req.params.CarId, (err, Car) => {
        if (err) {
            rest.send(err);
        }
        res.json(Car);
    });
};

export const updateCar = (req, res) => {
    Car.findOneAndUpdate({ _id: req.params.CarId }, req.body, { new: true }, (err, Car) => {
        if (err) {
            rest.send(err);
        }
        res.json(Car);
    });
};

export const deleteCar = (req, res) => {
    Car.deleteOne({ _id: req.params.CarId }, (err, Car) => {
        if (err) {
            rest.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    });
};