import { Router } from "express";
import { checkHealth } from "../controllers/healthController";

const healthRoutes = Router();

healthRoutes.get('/', checkHealth);

export default healthRoutes;
