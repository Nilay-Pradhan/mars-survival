import { Router } from "express";
import {getAllRation, addRation, getRation, updateRation, deleteRation, getSchedule} from "./ration";
const router = Router();

router.post('/getAllRation', getAllRation);
router.post('/addRation', addRation);
router.post('/getRation', getRation);
router.post('/updateRation', updateRation);
router.post('/deleteRation', deleteRation);
router.post('/getSchedule', getSchedule);

export default router;