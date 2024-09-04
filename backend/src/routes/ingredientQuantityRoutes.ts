import { Router } from "express";

import { createIngredientQuantity, 
    deleteIngredientQuantity, 
    getIngredientQuantity, 
    updateIngredientQuantity } from "../controllers/ingredientQuantityController";

const ingredientQuantityRoutes = Router();

ingredientQuantityRoutes.post('/', createIngredientQuantity);
ingredientQuantityRoutes.get('/:ingredientQuantityId', getIngredientQuantity);
ingredientQuantityRoutes.patch('/:ingredientQuantityId', updateIngredientQuantity);
ingredientQuantityRoutes.delete('/:ingredientQuantityId', deleteIngredientQuantity);

export default ingredientQuantityRoutes;
