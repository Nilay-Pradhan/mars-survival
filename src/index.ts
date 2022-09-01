import express from 'express';
import db from '../startup/db';
import errorHandler from '../startup/error';
import models from '../startup/models';
import router from '../startup/router';
import 'dotenv/config';
// import https from 'https';
// import fs from 'fs';


const app = express();

db();
models();
router(app);
errorHandler();

const port = process.env.PORT;

app.listen(port, () => console.log(`connnected on port ${port}`));

// var options = {
//     key: fs.readFileSync('./cert/key.pem'),
//     cert: fs.readFileSync('./cert/cert.pem')
// };


// http.createServer(options, app).listen(port, () => {
//     console.log(`connnected on port ${port}/`);
// });