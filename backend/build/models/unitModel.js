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
Object.defineProperty(exports, "__esModule", { value: true });
const databaseConnection_1 = require("../utils/databaseConnection");
const statusTypes_1 = require("../utils/statusTypes");
class UnitModel {
    static create(description) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, databaseConnection_1.connectDatabase)();
            try {
                const query = `INSERT INTO Unit (description) VALUES ("${description}");`;
                const [result] = yield connection.execute(query);
                return {
                    status: statusTypes_1.StatusType.Success,
                    value: result.insertId
                };
            }
            catch (error) {
                let message = 'Unknown Error';
                if (error instanceof Error)
                    message = error.message;
                return {
                    status: statusTypes_1.StatusType.Failure,
                    message: message
                };
            }
            finally {
                yield connection.end();
            }
        });
    }
}
exports.default = UnitModel;
