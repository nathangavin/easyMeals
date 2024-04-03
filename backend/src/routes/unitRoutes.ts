import { Router } from "express";

import { createUnit, getUnit } from "../controllers/unitController";

const unitRoutes = Router();

unitRoutes.post('/', createUnit);
unitRoutes.get('/:unitId', getUnit);


export default unitRoutes;



