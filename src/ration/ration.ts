import { Request, Response } from 'express';
import { Ration, validateAddRation, validateGetRation, validateUpdateRation, validateDeleteRation} from './_validation';
import _ from 'lodash';


export const getAllRation = async (req: Request, res: Response) => {
    let pageNumber: number = req.body.pageNumber ?? 0;
    let nPerPage: number = req.body.nPerPage ?? 20;
    
    let all_ration: any = await Ration.find({})
                                    .skip(pageNumber > 0 ? ( pageNumber - 1 ) * nPerPage : 0)
                                    .limit(nPerPage);
    if (!all_ration) return res.status(400).send({success: false, message: 'Ration not found! something went wrong' });

    res.status(200).send({success: true, data: all_ration});
};

export const addRation = async (req: Request, res: Response) => {
    console.log("@@@@@@@#############", req.body);
    
    const { error } = validateAddRation(req.body);
    if (error) throw error;

    let ration: any = await Ration.findOne({packet_id: req.body.packet_id})
    let payload: any = _.pick(req.body, [
        "packet_id",
        "packet_type",
        "packet_content",
        "calories",
        "expiry_date",
        "quantity_in_litres"
    ]);
    payload.created_at; new Date();
    payload.updated_at; new Date();
    console.log("ration", ration, "payload", payload);
    
    if (!ration){
        let register: any = new Ration(payload);
        register = await register.save();
        
        if (!register) return res.status(400).send({success: false, message: `Ration with packet Id ${req.body.packet_id} not found!`});
        res.status(200).send({success: true, data: payload});
    }else{
        res.status(400).send({success: false, message: `Ration with packet Id ${req.body.packet_id} already exist`});
    }

};

export const getRation = async (req: Request, res: Response) => {
    const { error } = validateGetRation(req.body);
    if (error) throw error;

    let ration: any = await Ration.findOne({ packet_id: req.body.packet_id });
    if (!ration) {
        res.status(400).send({success: false, message: `Ration with packet Id ${req.body.packet_id} not found!`});
    }
    res.status(200).send({success: true, data: ration });
};

export const updateRation = async (req: Request, res: Response) => {
    const { error } = validateUpdateRation(req.body);
    if (error) throw error;
    
    let payload: any = _.pick(req.body, [
        "packet_id",
        "packet_type",
        "packet_content",
        "calories",
        "quantity_in_litres"
    ]);
    payload.expiry_date = new Date(req.body.expiry_date).toISOString();
    payload.created_at; new Date();
    payload.updated_at; new Date();
    let ration: any = await Ration.updateOne({ packet_id: req.body.packet_id }, payload);
    console.log("ration", ration, "payload", payload);
    if (ration.modifiedCount === 0) return res.status(400).send({success: false, message: `ration with packet_id ${ req.body.packet_id } not updated!` });
        res.status(200).send({success: true, data: payload});

};

export const deleteRation = async (req: Request, res: Response) => {
    const { error } = validateDeleteRation(req.body);
    if (error) throw error;

    let ration: any = await Ration.deleteOne({ packet_id: req.body.packet_id });
    console.log('ration', ration);
    if (ration.deletedCount === 0) return res.status(400).send({success: false,  message: `ration with packet Id ${req.body.packet_id} not deleted!` });

    res.status(200).send({success: true, message: `ration with packet Id ${req.body.packet_id} deleted successfully` });
};

export const getSchedule = async (req: Request, res: Response) => {
    let data: any = await Ration.find({});
   
    function sortByProperty_decrease(property: string){
        return function(a: any,b: any){  
           if(new Date(a[property]) > new Date(b[property]))  
              return 1;  
           else if(new Date(a[property]) < new Date(b[property]))  
              return -1;  
       
           return 0;  
        }  
    }
    
    function sortByProperty(property: string){  
        return function(a: any, b: any){
           if(a[property] < b[property])  
              return 1;  
           else if(a[property] > b[property])  
              return -1;  
       
           return 0;  
        }  
    }
    
    function getWater(data: any){
        return data.filter((x: any) => x.calories === 0);
    }
    
    function removeWater(data: any){
        return data.filter((x: any) => x.calories != 0);
    }

    function addWater(_water: any, ration: any){
        let water = _water.sort(sortByProperty('quantity_in_litres'));
        let waterAdded: any = [];
        let i: number = 0;
        let j: number = 0;
        let temp: number = 0;
        while (j < ration.length) {
            if (i <= (water.length - 1)) {
                if(water[i].quantity_in_litres === 2 && temp === 0){
                    waterAdded.push([...ration[j], water[i]]);
                    i++;
                    j++;
                }else if(water[i].quantity_in_litres == 1){
                    temp++;
                    if(temp == 2){
                        let x = waterAdded.pop();
                        waterAdded.push([...x, water[i]]);
                        j++;
                        temp = 0;
                    }else{
                        waterAdded.push([...ration[j], water[i]]);
                    }
                    i++;
                }
            }else{
                waterAdded.push([...ration[j]]);
                j++;
            }
        }
        return waterAdded;
    }
    
    function createDailyRation(data: any){
        let i = 0;
        let j = data.length - 1;
        let stack: any = [];
        data = data.sort(sortByProperty_decrease('expiry_date'))
        while (i < data.length) {
            if(data[i].calories + data[j].calories === 2500){
                stack.push([data[i], data[j]]);
                data.splice(i, 1);
                j-1 < 0 ? data.splice(0, 1) : data.splice(j-1, 1)
                i++;
                j = data.length - 1;
            }else{
                j--;
            }
            if (j < 0) {
                i++;
                j = data.length - 1;
            }
        }
    
        data = data.sort(sortByProperty('calories'))
        console.log("stack", stack.length);
        stack.push(...data.map((x: any) => [x]))
        return [stack, stack.length];
        // return stack;
    }
    let water = getWater(data);
    let total_water = 0;
    water.map((x: any) => total_water += x.quantity_in_litres);
    let allRations = removeWater(data);
    let [dailyRation, total_ration] = createDailyRation(allRations);
    let output = addWater(water, dailyRation);
    // console.log("output -------------------------------", output);
    
    total_water = Math.ceil(total_water / 2);
    let total_survival_days = total_ration;
    if(total_water < total_ration){
        total_survival_days = total_water;
    }
    res.status(200).send({success: true, data: output, days: total_survival_days});
};