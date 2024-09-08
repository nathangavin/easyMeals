import { Router } from "express";

import { createSession, 
        getSession, 
        deleteSession, 
        updateSession, 
        getAllSessions } from "../controllers/sessionController";

const sessionRoutes = Router();

sessionRoutes.post('/', createSession);
sessionRoutes.get('/', getAllSessions);
sessionRoutes.get('/:sessionID', getSession);
sessionRoutes.patch('/:sessionID', updateSession);
sessionRoutes.delete('/:sessionToken', deleteSession);

export default sessionRoutes;
