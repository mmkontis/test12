import { 
    addNewCar,
    getCars,
    getCarWithId,
    updateCar,
    deleteCar
} from '../controllers/carController';

const routes = (app) => {
    app.route('/cars')
        .get(getCars)
        .post(addNewCar);

    app.route('/car/:CarId')
        .get(getCarWithId)
        .put(updateCar)
        .delete(deleteCar);
}

export default routes;