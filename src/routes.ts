import express from 'express';
import ration from '../src/ration/_route';


const app = express();

app.use('/ration', ration);


export default app;