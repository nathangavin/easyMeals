import Joi from "joi";

import UnitDbInterface, { Unit, UnitDbNames } from "../../models/test/unitModel";
import { Controller } from "../common/controller";

const unitController : Controller<Unit> = new Controller<Unit>(
    Joi.object({
        desc: Joi.string().alphanum().min(1).max(20).required()
    }),
    Joi.object({
        desc: Joi.string().alphanum().min(1).max(20).required()
    }),
    new UnitDbInterface(),
    Unit,
    'unitId',
    ['desc'],
    UnitDbNames
);

export default unitController;
