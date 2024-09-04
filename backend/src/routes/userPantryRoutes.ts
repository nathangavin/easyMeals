import { Router } from "express";

import { createUserPantry, 
    deleteUserPantry, 
    getUserPantry, 
    updateUserPantry } from "../controllers/userPantryController";

const userPantryRoutes = Router();

userPantryRoutes.post('/', createUserPantry);
userPantryRoutes.get('/:userPantryId', getUserPantry);
userPantryRoutes.patch('/:userPantryId', updateUserPantry);
userPantryRoutes.delete('/:userPantryId', deleteUserPantry);

export default userPantryRoutes;
