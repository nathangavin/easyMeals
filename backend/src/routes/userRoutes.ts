import { Router } from "express";

import { createUser, getUser, login, logout } from "../controllers/userController";

const userRoutes = Router();

userRoutes.post('/', createUser);
userRoutes.get('/:userId', getUser);
userRoutes.post('/login', login);
userRoutes.post('/logout/:userId', logout);

export default userRoutes;
