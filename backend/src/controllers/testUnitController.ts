import Joi from "joi";
import { Request, 
        Response } from "express";
import { DbCommon, 
        DbCommonConstructor, 
        DbInterface, 
        DbNames, 
        createDbCommonInstance } from "../models/common/tableInterface";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG } from "../utils/messages";
import { handleCreateResponse, 
        handleGetAllResponse, 
        handleGetResponse, 
        handleUpdateDeleteResponse } from "../utils/controllerUtils";

export class Controller<T extends DbCommon> {
    createSchema: Joi.ObjectSchema;
    updateSchema: Joi.ObjectSchema;
    dbInterface: DbInterface<T>;
    tableConstructor: DbCommonConstructor<T>;
    idField: string;
    bodyFields: string[];
    dbNames: DbNames;
      
    constructor(createSchema: Joi.ObjectSchema,
                updateSchema: Joi.ObjectSchema,
                dbInterface: DbInterface<T>,
                tableConstructor: DbCommonConstructor<T>,
                idField: string,
                bodyFields: string[],
                dbNames: DbNames) {

        this.createSchema = createSchema;
        this.updateSchema = updateSchema;
        this.dbInterface = dbInterface;
        this.tableConstructor = tableConstructor;
        this.idField = idField;
        this.bodyFields = bodyFields;
        this.dbNames = dbNames;
    }

    extractValues(request: Request): any[] {
        let values = [];
        for (const field of this.bodyFields) {
            values.push(request.body[field]);
        }
        return values;
    }
    
    async create(request: Request, response: Response): Promise<void> {
        try {
            const { error } = this.createSchema.validate(request.body);
            if (error) {
                response.status(400).json({
                    message: error.details[0].message
                });
                return;
            } 
                
            const record = createDbCommonInstance(this.tableConstructor, 
                                                  ...this.extractValues(request));
            const dbResponse = await this.dbInterface.create(record);
            const processedResponse = handleCreateResponse(dbResponse, 
                                                           this.dbNames.messageName);
            response.status(processedResponse.status)
                    .json(processedResponse.json);
            return;
                        
        } catch (err) {
            console.log(err);
            response.status(500).json({
                error: INTERNAL_SERVER_ERROR_MSG,
                message: err
            });
        }
    }

    async get(request: Request, response: Response): Promise<void> {
        try {
            const id = +request.params[this.idField];
            if (isNaN(id)) {
                response.status(400).json({
                    message: INVALID_PARAM_MSG('ID')
                });
                return;
            }

            const dbResponse = await this.dbInterface.get(id);
            const processedResponse = handleGetResponse(dbResponse,
                                                      this.dbNames.fieldName,
                                                      this.dbNames.messageName);
            response.status(processedResponse.status)
                    .json(processedResponse.json);
            return;
        } catch (err) {
            console.log(err);
            response.status(500).json({
                error: INTERNAL_SERVER_ERROR_MSG,
                message: err
            });
        }
    }

    async getAll(_request: Request, response: Response): Promise<void> {
        try {
            const dbResponse = await this.dbInterface.getAll();
            const processedResponse = handleGetAllResponse(dbResponse,
                                                          this.dbNames.multipleFieldName,
                                                          this.dbNames.messageName);
            response.status(processedResponse.status)
                    .json(processedResponse.json);
            return;
        } catch (err) {
            console.log(err);
            response.status(500).json({
                error: INTERNAL_SERVER_ERROR_MSG,
                message: err
            });
        }
    }

    async update(request: Request, response: Response): Promise<void> {
        try {
            const id = +request.params[this.idField];
            if (isNaN(id)) {
                response.status(400).json({
                    message: INVALID_PARAM_MSG('ID')
                });
                return;
            }

            const { error } = this.updateSchema.validate(request.body);
            if (error) {
                response.status(400).json({
                    message: error.details[0].message
                });
                return;
            }
            
            const updatedRecord = createDbCommonInstance(this.tableConstructor,
                                                        ...this.extractValues(request));
            const dbResponse = await this.dbInterface.update(id, updatedRecord);
            const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                                'Update',
                                                                this.dbNames.messageName);
            response.status(processedResponse.status)                                                                
                    .json(processedResponse.json);
            return;

        } catch (err) {
            console.log(err);
            response.status(500).json({
                error: INTERNAL_SERVER_ERROR_MSG,
                message: err
            });
        }
    }

    async delete(request: Request, response: Response): Promise<void> {
        try {
            const id = +request.params[this.idField];
            if (isNaN(id)) {
                response.status(400).json({
                    message: INVALID_PARAM_MSG('ID')
                });
                return;
            }

            const dbResponse = await this.dbInterface.delete(id);
            const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                                'Delete',
                                                                this.dbNames.messageName);
            response.status(processedResponse.status)
                    .json(processedResponse.json);
            return;
        } catch (err) {
            console.log(err);
            response.status(500).json({
                error: INTERNAL_SERVER_ERROR_MSG,
                message: err
            });
        }
    }

}

