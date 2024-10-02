import { Router } from "express";

import recipeController from "../../controllers/test/recipeController";

const recipeRoutes = Router();

recipeRoutes.post('/', recipeController.create.bind(recipeController));
recipeRoutes.get('/', recipeController.getAll.bind(recipeController));
recipeRoutes.get('/:recipeId', recipeController.get.bind(recipeController));
recipeRoutes.patch('/:recipeId', recipeController.update.bind(recipeController));
recipeRoutes.delete('/:recipeId', recipeController.delete.bind(recipeController));

export default recipeRoutes;
