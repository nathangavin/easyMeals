import Joi from "joi";

import UnitDbInterface, { Unit } from "../models/testUnitModel";
import { Controller } from "../controllers/testUnitController";
import { DbNames } from "../models/common/tableInterface";
import { Router } from "express";

const unitController : Controller<Unit> = new Controller<Unit>(
    Joi.object({
        desc: Joi.string().alphanum().min(1).max(20).required()
    }),
    Joi.object({
        desc: Joi.string().alphanum().min(1).max(20)
    }),
    new UnitDbInterface(),
    Unit,
    'unitId',
    ['desc'],
    {
        tableName: 'Units',
        messageName: 'Unit',
        fieldName: 'unit',
        multipleFieldName: 'units'
    } as DbNames
);

const testRoutes = Router();

testRoutes.post('/', unitController.create.bind(unitController));
testRoutes.get('/', unitController.getAll.bind(unitController));
testRoutes.get('/:unitId', unitController.get.bind(unitController));
testRoutes.patch('/:unitId', unitController.update.bind(unitController));
testRoutes.delete('/:unitId', unitController.delete.bind(unitController));

export default testRoutes;
