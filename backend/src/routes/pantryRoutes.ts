import { Router } from "express";

import { createPantry, 
    deletePantry, 
    getPantry, 
    updatePantry } from "../controllers/pantryController";

const pantryRoutes = Router();

pantryRoutes.post('/', createPantry);
pantryRoutes.get('/:pantryId', getPantry);
pantryRoutes.patch('/:pantryId', updatePantry);
pantryRoutes.delete('/:pantryId', deletePantry);

export default pantryRoutes;



