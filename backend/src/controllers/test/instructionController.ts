import Joi from "joi";

import InstructionDbInterface, {Instruction, InstructionDbNames} from "../../models/test/instructionModel";
import { Controller } from "../common/controller";

const instructionController : Controller<Instruction> = new Controller<Instruction>(
    Joi.object({
        description: Joi.string().alphanum().min(1).max(256).required()
    }),
    Joi.object({
        description: Joi.string().alphanum().min(1).max(256).required()
    }),
    new InstructionDbInterface(),
    Instruction,
    'instructionId',
    ['name'],
    InstructionDbNames
);

export default instructionController;
