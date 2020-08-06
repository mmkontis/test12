import { addNewCar } from '../controllers/carController';

const routes = (app) => {
    app.route('/cars')
        .post(addNewCar);
}

export default routes;