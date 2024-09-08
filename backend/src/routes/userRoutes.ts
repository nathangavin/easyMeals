import { Router } from "express";

import { createUser, 
        deleteUser, 
        getAllUsers, 
        getUser, 
        updateUser } from "../controllers/userController";

const userRoutes = Router();

userRoutes.post('/', createUser);
userRoutes.get('/', getAllUsers);
userRoutes.get('/:userId', getUser);
userRoutes.patch('/:userId', updateUser);
userRoutes.delete('/:userId', deleteUser);

export default userRoutes;
