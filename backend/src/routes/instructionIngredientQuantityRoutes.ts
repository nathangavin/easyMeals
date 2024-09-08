import { Router } from "express";

import { createInstructionIngredientQuantity, 
    deleteInstructionIngredientQuantity, 
    getAllInstructionIngredientQuantities, 
    getInstructionIngredientQuantity, 
    updateInstructionIngredientQuantity } from "../controllers/instructionIngredientQuantityController";

const instructionIngredientQuantityRoutes = Router();

instructionIngredientQuantityRoutes.post('/', createInstructionIngredientQuantity);
instructionIngredientQuantityRoutes.get('/', getAllInstructionIngredientQuantities);
instructionIngredientQuantityRoutes.get('/:instructionIngredientQuantityId', getInstructionIngredientQuantity);
instructionIngredientQuantityRoutes.patch('/:instructionIngredientQuantityId', updateInstructionIngredientQuantity);
instructionIngredientQuantityRoutes.delete('/:instructionIngredientQuantityId', deleteInstructionIngredientQuantity);

export default instructionIngredientQuantityRoutes;
