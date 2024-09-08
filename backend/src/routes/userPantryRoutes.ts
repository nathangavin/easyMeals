import { Router } from "express";

import { createUserPantry, 
    deleteUserPantry, 
    getAllUserPantries, 
    getUserPantry, 
    updateUserPantry } from "../controllers/userPantryController";

const userPantryRoutes = Router();

userPantryRoutes.post('/', createUserPantry);
userPantryRoutes.get('/', getAllUserPantries);
userPantryRoutes.get('/:userPantryId', getUserPantry);
userPantryRoutes.patch('/:userPantryId', updateUserPantry);
userPantryRoutes.delete('/:userPantryId', deleteUserPantry);

export default userPantryRoutes;
