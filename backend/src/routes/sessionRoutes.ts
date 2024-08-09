import { Router } from "express";

import { createSession, logout } from "../controllers/sessionController";

const sessionRoutes = Router();

sessionRoutes.post('/', createSession);
sessionRoutes.delete('/:userId', logout);

export default sessionRoutes;
