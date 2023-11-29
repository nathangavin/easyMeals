"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const unitController_1 = require("../controllers/unitController");
const unitRouter = express_1.default.Router();
unitRouter.use((0, helmet_1.default)());
unitRouter.use((0, morgan_1.default)('dev'));
unitRouter.post('/units', unitController_1.createUnit);
exports.default = unitRouter;
