import { Router } from "express";

import instructionController from "../../controllers/test/instructionController";

const instructionRoutes = Router();

instructionRoutes.post('/', instructionController.create.bind(instructionController));
instructionRoutes.get('/', instructionController.getAll.bind(instructionController));
instructionRoutes.get('/:instructionId', instructionController.get.bind(instructionController));
instructionRoutes.patch('/:instructionId', instructionController.update.bind(instructionController));
instructionRoutes.delete('/:instructionId', instructionController.delete.bind(instructionController));

export default instructionRoutes;
