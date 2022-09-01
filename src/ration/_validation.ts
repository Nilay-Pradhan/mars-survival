import { model } from "mongoose";
// import mongoose from "mongoose";
import { rationSchema } from "../../models/ration";

import Joi from 'joi';
export const Ration = model('Ration', rationSchema);

export const validateAddRation = (data: any) => {
        console.log(data);
        
    const schema = Joi.object({
        packet_id: Joi.string().label('packet_id'),
        packet_type: Joi.string().label('packet_type'),
        packet_content: Joi.alternatives().conditional('packet_type', { is: 'Food', then: Joi.string().required(), otherwise: Joi.string().empty('') }).label('Packet Content'),
        calories: Joi.alternatives().conditional('packet_type', { is: 'Food', then: Joi.number().greater(0).required(), otherwise: Joi.number().required() }).label('calories'),
        expiry_date: Joi.alternatives().conditional('packet_type', { is: 'Food', then: Joi.date().required(), otherwise: Joi.date().empty('') }).label('Expiry Date'),
        quantity_in_litres: Joi.alternatives().conditional('packet_type', { is: 'Food', then: Joi.number().max(0).required(), otherwise: Joi.number().greater(0).required() }).label('quantity_in_litres'),
    })
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
}

export const validateGetRation = (data: any) => {
    const schema = Joi.object({
        packet_id: Joi.string().required().label('packet_id is required')
    })
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
}

export const validateUpdateRation = (data: any) => {
    const schema = Joi.object({
        packet_id: Joi.string().label('packet_id'),
        packet_type: Joi.string().label('packet_type'),
        packet_content: Joi.string().label('packet_content'),
        calories: Joi.number().label('calories'),
        expiry_date: Joi.alternatives().conditional('packet_type', { is: 'Food', then: Joi.date().required(), otherwise: Joi.date().empty('') }).label('Expiry Date'),
        // expiry_date: Joi.date(),
        quantity_in_litres: Joi.number().label('quantity_in_litres')
    })
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
}

export const validateDeleteRation = (data: any) => {
    const schema = Joi.object({
        packet_id: Joi.string().required().label('packet_id is required')
    })
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
}