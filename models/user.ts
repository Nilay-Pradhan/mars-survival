import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
    _id : {type: mongoose.Types.ObjectId, auto: true},
    fullname : {type: String, default: ''},
    email_id : {type: String, default: ''},
    address : {type: String, default: ''},
    city : {type: String, default: ''},
    postal_code : {type: String, default: ''},
    state : {type: String, default: ''},
    created_at : { type: Date, default: new Date() },
    updated_at : { type: Date, default: new Date() },
}, { collection: 'user' });

