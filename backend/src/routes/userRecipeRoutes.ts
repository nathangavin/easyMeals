import { Router } from "express";

import { createUserRecipe, 
        deleteUserRecipe, 
        getAllUserRecipes, 
        getUserRecipe, 
        updateUserRecipe } from "../controllers/userRecipeController";

const userRecipeRoutes = Router();

userRecipeRoutes.post('/', createUserRecipe);
userRecipeRoutes.get('/', getAllUserRecipes);
userRecipeRoutes.get('/:userRecipeId', getUserRecipe);
userRecipeRoutes.patch('/:userRecipeId', updateUserRecipe);
userRecipeRoutes.delete('/:userRecipeId', deleteUserRecipe);

export default userRecipeRoutes;
