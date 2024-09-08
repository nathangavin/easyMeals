import { Router } from "express";

import { createInstruction, 
    deleteInstruction, 
    getAllInstructions, 
    getInstruction, 
    updateInstruction } from "../controllers/instructionController";

const instructionRoutes = Router();

instructionRoutes.post('/', createInstruction);
instructionRoutes.get('/', getAllInstructions);
instructionRoutes.get('/:instructionId', getInstruction);
instructionRoutes.patch('/:instructionId', updateInstruction);
instructionRoutes.delete('/:instructionId', deleteInstruction);

export default instructionRoutes;
