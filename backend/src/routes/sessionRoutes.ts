import { Router } from "express";

import { createSession, getSession, deleteSession, updateSession } from "../controllers/sessionController";

const sessionRoutes = Router();

sessionRoutes.post('/', createSession);
sessionRoutes.get('/:sessionID', getSession);
sessionRoutes.patch('/:sessionID', updateSession);
sessionRoutes.delete('/:sessionToken', deleteSession);

export default sessionRoutes;
