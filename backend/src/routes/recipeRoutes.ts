import { Router } from "express";

import { createRecipe, 
        deleteRecipe, 
        getAllRecipes, 
        getRecipe, 
        updateRecipe } from "../controllers/recipeController";

const recipeRoutes = Router();

recipeRoutes.post('/', createRecipe);
recipeRoutes.get('/', getAllRecipes);
recipeRoutes.get('/:recipeId', getRecipe);
recipeRoutes.patch('/:recipeId', updateRecipe);
recipeRoutes.delete('/:recipeId', deleteRecipe);

export default recipeRoutes;
