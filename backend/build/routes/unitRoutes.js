"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unitController_1 = require("../controllers/unitController");
const unitRoutes = (0, express_1.Router)();
unitRoutes.post('/', unitController_1.createUnit);
unitRoutes.get('/:unitId', unitController_1.getUnit);
exports.default = unitRoutes;
