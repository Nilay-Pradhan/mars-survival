import mongoose, { Schema } from "mongoose";

export const rationSchema = new Schema({
    _id : {type: mongoose.Types.ObjectId, auto: true},
    packet_id: {type: String, default: ''},
    packet_type: {type: String, default: ''},
    packet_content: {type: String, default: ''},
    calories: {type: Number, default: 0},
    expiry_date: {type: Date, default: ''},
    quantity_in_litres: {type: Number, default: 0},
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() },
}, { collection: 'ration' });