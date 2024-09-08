import { Router } from "express";

import { createPantry, 
    deletePantry, 
    getAllPantries, 
    getPantry, 
    updatePantry } from "../controllers/pantryController";

const pantryRoutes = Router();

pantryRoutes.post('/', createPantry);
pantryRoutes.get('/', getAllPantries);
pantryRoutes.get('/:pantryId', getPantry);
pantryRoutes.patch('/:pantryId', updatePantry);
pantryRoutes.delete('/:pantryId', deletePantry);

export default pantryRoutes;



