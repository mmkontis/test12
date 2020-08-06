import { addNewCar, getCars } from '../controllers/carController';

const routes = (app) => {
    app.route('/cars')
        .get(getCars)
        .post(addNewCar);
}

export default routes;