import { Router } from "express";

import { createUserRecipe, getUserRecipe } from "../controllers/userRecipeController";

const userRecipeRoutes = Router();

userRecipeRoutes.post('/', createUserRecipe);
userRecipeRoutes.get('/:userRecipeId', getUserRecipe);

export default userRecipeRoutes;
