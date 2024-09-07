import { Router } from "express";

import { createUnit, 
        deleteUnit, 
        getAllUnits, 
        getUnit, 
        updateUnit } from "../controllers/unitController";

const unitRoutes = Router();

unitRoutes.post('/', createUnit);
unitRoutes.get('/', getAllUnits);
unitRoutes.get('/:unitId', getUnit);
unitRoutes.patch('/:unitId', updateUnit);
unitRoutes.delete('/:unitId', deleteUnit);


export default unitRoutes;
