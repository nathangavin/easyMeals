import { Router } from "express";

import { createInstructionIngredientQuantity, 
    deleteInstructionIngredientQuantity, 
    getInstructionIngredientQuantity, 
    updateInstructionIngredientQuantity } from "../controllers/instructionIngredientQuantityController";

const instructionIngredientQuantityRoutes = Router();

instructionIngredientQuantityRoutes.post('/', createInstructionIngredientQuantity);
instructionIngredientQuantityRoutes.get('/:instructionIngredientQuantityId', getInstructionIngredientQuantity);
instructionIngredientQuantityRoutes.patch('/:instructionIngredientQuantityId', updateInstructionIngredientQuantity);
instructionIngredientQuantityRoutes.delete('/:instructionIngredientQuantityId', deleteInstructionIngredientQuantity);

export default instructionIngredientQuantityRoutes;
