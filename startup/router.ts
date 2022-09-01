import cors from 'cors';
import { json, NextFunction, Request, Response } from 'express';
import { errorHandler } from '../middleware/error';
import router from '../src/routes';
export default (app: any) => {
    app.use(json());
    app.use(cors());
    app.use('/', router);
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log('Url not found', req.url);
        res.status(404).json({ message: "URL not found." });
    })

    app.use(errorHandler);
};