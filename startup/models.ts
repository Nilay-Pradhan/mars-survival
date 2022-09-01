import { model } from "mongoose";
import { rationSchema } from "../models/ration";
import { userSchema } from "../models/user";

export default () => {
    model('Ration', rationSchema);
    model('User', userSchema);
};