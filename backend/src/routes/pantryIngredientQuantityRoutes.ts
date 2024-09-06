import { Router } from "express";

import { createPantryIngredientQuantity, 
    deletePantryIngredientQuantity, 
    getPantryIngredientQuantity, 
    updatePantryIngredientQuantity } from "../controllers/pantryIngredientQuantityController";

const pantryIngredientQuantityRoutes = Router();

pantryIngredientQuantityRoutes.post('/', createPantryIngredientQuantity);
pantryIngredientQuantityRoutes.get('/:pantryIngredientQuantityId', getPantryIngredientQuantity);
pantryIngredientQuantityRoutes.patch('/:pantryIngredientQuantityId', updatePantryIngredientQuantity);
pantryIngredientQuantityRoutes.delete('/:pantryIngredientQuantityId', deletePantryIngredientQuantity);

export default pantryIngredientQuantityRoutes;
