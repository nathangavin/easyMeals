import { Router } from "express";

import { createRecipe, 
        deleteRecipe, 
        getRecipe, 
        updateRecipe } from "../controllers/recipeController";

const recipeRoutes = Router();

recipeRoutes.post('/', createRecipe);
recipeRoutes.get('/:recipeId', getRecipe);
recipeRoutes.put('/:recipeId', updateRecipe);
recipeRoutes.delete('/:recipeId', deleteRecipe);

export default recipeRoutes;
