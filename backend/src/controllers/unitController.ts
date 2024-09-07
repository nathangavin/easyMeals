import { Request, Response } from "express";
import joi from "joi";
import UnitModel, { Unit } from "../models/unitModel";
import { INTERNAL_SERVER_ERROR_MSG, 
    INVALID_PARAM_MSG } from "../utils/messages";
import { handleCreateResponse, handleGetAllResponse, handleGetResponse, handleUpdateDeleteResponse } from "../utils/controllerUtils";

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
                message: error.details[0].message
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
                message: INVALID_PARAM_MSG('ID')
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

export async function getAllUnits(request: Request,
                                    response: Response) : Promise<void> {
    
    try {
        // get objects from db
        const dbResponse = await UnitModel.getAll();
        console.log(dbResponse);
        const processedResponse = handleGetAllResponse(dbResponse,
                                                   'units',
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

export async function updateUnit(request: Request,
                                    response: Response) : Promise<void> {
    const schema = joi.object({
        desc: joi.string().alphanum().min(1).max(20)
    });
    try {
        const id = +request.params.unitId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        }

        const { error } = schema.validate(request.body);
        if (error) { 
            response.status(400).json({
                message: error.details[0].message
            });
            return;
        }

        const updatedUnit = {
            description: request.body.desc
        } as Unit;

        const dbResponse = await UnitModel.update(id, updatedUnit);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                            'Update',
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

export async function deleteUnit(request: Request,
                                    response: Response) : Promise<void> {
    try {
        const id = +request.params.unitId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        }
        const dbResponse = await UnitModel.delete(id);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                            'Delete',
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

