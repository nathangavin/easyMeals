import { Router } from "express";

import { createIngredient, 
    deleteIngredient, 
    getIngredient, 
    updateIngredient } from "../controllers/ingredientController";

const ingredientRoutes = Router();

ingredientRoutes.post('/', createIngredient);
ingredientRoutes.get('/:ingredientId', getIngredient);
ingredientRoutes.patch('/:ingredientId', updateIngredient);
ingredientRoutes.delete('/:ingredientId', deleteIngredient);

export default ingredientRoutes;
