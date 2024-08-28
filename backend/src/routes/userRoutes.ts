import { Router } from "express";

import { createUser, 
        getUser, 
        updateUser } from "../controllers/userController";

const userRoutes = Router();

userRoutes.post('/', createUser);
userRoutes.get('/:userId', getUser);
userRoutes.put('/:userId', updateUser);

export default userRoutes;
