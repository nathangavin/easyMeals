"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnit = exports.createUnit = void 0;
const joi_1 = __importDefault(require("joi"));
function createUnit(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object({
            desc: joi_1.default.string().alphanum().min(1).max(20).required()
        });
        try {
            // use the defined schema to validate the payload
            const { error, value } = schema.validate(request.body);
            if (error) {
                response.status(400).json({
                    error: error.details[0].message
                });
            }
            // process the request by loading data into database
            response.status(201).json({
                message: 'Unit created succesfully',
                data: value
            });
        }
        catch (err) {
            console.log(err);
            response.status(500).json({
                error: 'Internal Server Error'
            });
        }
    });
}
exports.createUnit = createUnit;
function getUnit(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('get response');
            const id = request.params.unitId;
            console.log(id);
            // get object from db
            const data = { id };
            response.status(200).json({
                data: data
            });
        }
        catch (err) {
            console.log(err);
            response.status(500).json({
                error: 'Internal Server Error'
            });
        }
    });
}
exports.getUnit = getUnit;
