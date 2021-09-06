import express from 'express';
import { PersonRoutesApi } from "./person.route";
import { OrderRoutesApi } from "./order.route";
export class MainRouter {
    router: express.Router;
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    routes() {
        this.router.use('/person',PersonRoutesApi);
        this.router.use('/order',OrderRoutesApi);

    }


}
export const MainApi = new MainRouter().router;