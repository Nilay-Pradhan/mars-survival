import mongoose from 'mongoose';
import 'dotenv/config';

export default () => {
    const db: any = process.env.DB_URL;
    if (db != null) {
        mongoose.connect(db, (err: any) => {
            if (err) {
                console.log(err.message);
                process.exit(1);
            } else {
                console.log("Database Connected Successfully...");
            }
        });
    } else {
        console.log("Unable to connect database, please try again later");
        process.exit(1);
    }
};