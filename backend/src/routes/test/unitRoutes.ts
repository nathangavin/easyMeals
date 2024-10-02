import { Router } from "express";

import unitController from "../../controllers/test/unitController";

const unitRoutes = Router();

unitRoutes.post('/', unitController.create.bind(unitController));
unitRoutes.get('/', unitController.getAll.bind(unitController));
unitRoutes.get('/:unitId', unitController.get.bind(unitController));
unitRoutes.patch('/:unitId', unitController.update.bind(unitController));
unitRoutes.delete('/:unitId', unitController.delete.bind(unitController));

export default unitRoutes;
