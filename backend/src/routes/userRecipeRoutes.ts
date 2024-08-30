import { Router } from "express";

import { createUserRecipe, deleteUserRecipe, getUserRecipe, updateUserRecipe } from "../controllers/userRecipeController";

const userRecipeRoutes = Router();

userRecipeRoutes.post('/', createUserRecipe);
userRecipeRoutes.get('/:userRecipeId', getUserRecipe);
userRecipeRoutes.patch('/:userRecipeId', updateUserRecipe);
userRecipeRoutes.delete('/:userRecipeId', deleteUserRecipe);

export default userRecipeRoutes;
