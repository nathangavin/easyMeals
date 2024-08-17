import { Router } from "express";

import { createRecipe, getRecipe } from "../controllers/recipeController";

const recipeRoutes = Router();

recipeRoutes.post('/', createRecipe);
recipeRoutes.get('/:recipeId', getRecipe);

export default recipeRoutes;
