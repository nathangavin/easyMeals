import { Request, Response } from "express";
import joi from "joi";
import UnitModel from "../models/unitModel";
import { StatusType } from "../utils/statusTypes";
import { INTERNAL_SERVER_ERROR_MSG, 
    INVALID_PARAM_MSG, 
    RECORD_CREATED_SUCCESSFULLY_MSG, 
    RECORD_MISSING_MSG, 
    UNREACHABLE_CODE_UNKNOWN_STATUS_MSG } from "../utils/messages";
import { handleCreateResponse, handleGetResponse } from "../utils/controllerUtils";

export async function createUnit(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        desc: joi.string().alphanum().min(1).max(20).required()
    });

    try {
        // use the defined schema to validate the payload
        const { error } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                error: error.details[0].message
            });
        }
        
        const dbResponse = await UnitModel.create(request.body.desc);
        const processedResponse = handleCreateResponse(dbResponse,
                                                      'Unit');
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

export async function getUnit(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = +request.params.unitId;
        if (isNaN(id)) {
            response.status(400).json({
                error: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        // get object from db
        const dbResponse = await UnitModel.get(id);
        const processedResponse = handleGetResponse(dbResponse,
                                                   'unit',
                                                   'Unit');
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

