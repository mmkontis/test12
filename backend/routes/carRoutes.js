import { 
    addNewCar,
    getCars,
    getCarWithId,
    updateCar
} from '../controllers/carController';

const routes = (app) => {
    app.route('/cars')
        .get(getCars)
        .post(addNewCar);

    app.route('/car/:CarId')
        .get(getCarWithId)
        .put(updateCar);
}

export default routes;