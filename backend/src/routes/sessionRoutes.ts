import { Router } from "express";

import { createSession, getSession, logout } from "../controllers/sessionController";

const sessionRoutes = Router();

sessionRoutes.post('/', createSession);
sessionRoutes.get('/:sessionID', getSession);
sessionRoutes.delete('/:sessionToken', logout);

export default sessionRoutes;
