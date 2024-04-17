import { Router } from "express";

import { createUser, getUser } from "../controllers/userController";

const userRoutes = Router();

userRoutes.post('/', createUser);
userRoutes.get('/:userId', getUser);


export default userRoutes;
