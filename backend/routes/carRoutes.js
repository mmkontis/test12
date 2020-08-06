import { 
    addNewCar,
    getCars,
    getCarWithId
} from '../controllers/carController';

const routes = (app) => {
    app.route('/cars')
        .get(getCars)
        .post(addNewCar);

    app.route('/car/:CarId')
        .get(getCarWithId);
}

export default routes;