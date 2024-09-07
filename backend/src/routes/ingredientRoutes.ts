import { Router } from "express";

import { createIngredient, 
    deleteIngredient, 
    getAllIngredients, 
    getIngredient, 
    updateIngredient } from "../controllers/ingredientController";

const ingredientRoutes = Router();

ingredientRoutes.post('/', createIngredient);
ingredientRoutes.get('/', getAllIngredients);
ingredientRoutes.get('/:ingredientId', getIngredient);
ingredientRoutes.patch('/:ingredientId', updateIngredient);
ingredientRoutes.delete('/:ingredientId', deleteIngredient);

export default ingredientRoutes;
