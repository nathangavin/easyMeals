import { Router } from "express";

import { createPantryIngredientQuantity, 
    deletePantryIngredientQuantity, 
    getAllPantryIngredientQuantities, 
    getPantryIngredientQuantity, 
    updatePantryIngredientQuantity } from "../controllers/pantryIngredientQuantityController";

const pantryIngredientQuantityRoutes = Router();

pantryIngredientQuantityRoutes.post('/', createPantryIngredientQuantity);
pantryIngredientQuantityRoutes.get('/', getAllPantryIngredientQuantities);
pantryIngredientQuantityRoutes.get('/:pantryIngredientQuantityId', getPantryIngredientQuantity);
pantryIngredientQuantityRoutes.patch('/:pantryIngredientQuantityId', updatePantryIngredientQuantity);
pantryIngredientQuantityRoutes.delete('/:pantryIngredientQuantityId', deletePantryIngredientQuantity);

export default pantryIngredientQuantityRoutes;
