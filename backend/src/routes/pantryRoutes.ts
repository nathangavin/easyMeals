import { Router } from "express";

import { createPantry, getPantry } from "../controllers/pantryController";

const pantryRoutes = Router();

pantryRoutes.post('/', createPantry);
pantryRoutes.get('/:pantryId', getPantry);


export default pantryRoutes;



