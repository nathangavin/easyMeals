import { Request, Response } from "express";
import joi from "joi";
import PantryModel, {Pantry } from "../models/pantryModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_CREATED_SUCCESSFULLY_MSG, 
        UNREACHABLE_CODE_UNKNOWN_STATUS_MSG } from "../utils/messages";
import { handleCreateResponse, handleGetResponse, handleUpdateDeleteResponse } from "../utils/controllerUtils";

export async function createPantry(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        name: joi.string().alphanum().min(1).max(20).required()
    });

    try {
        // use the defined schema to validate the payload
        const { error } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                message: error.details[0].message
            });
            return;
        }
        
        const dbResponse = await PantryModel.create(request.body.desc);
        const processedResponse = handleCreateResponse(dbResponse, 'Pantry');
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

export async function getPantry(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = +request.params.pantryId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const dbResponse = await PantryModel.get(id);
        const processedResponse = handleGetResponse(dbResponse,'pantry', 'Pantry');
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

export async function updatePantry(request: Request,
                                    response: Response) : Promise<void> {
    const schema = joi.object({
        name: joi.string().alphanum().min(1).max(20)
    });
    try {
        const id = +request.params.pantryId;
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

        const updatedPantry = {
            name: request.body.name
        } as Pantry;

        const dbResponse = await PantryModel.update(id, updatedPantry);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                             'Update', 
                                                             'Pantry');
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

export async function deletePantry(request: Request,
                                    response: Response) : Promise<void> {
    try {
        const id = +request.params.pantryId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const dbResponse = await PantryModel.delete(id);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                            'Delete',
                                                            'Pantry');
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

