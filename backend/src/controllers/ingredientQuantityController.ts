import { Request, Response } from "express";
import joi from "joi";
import IngredientQuantityModel, { IngredientQuantity } from "../models/ingredientQuantityModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_MISSING_MSG } from "../utils/messages";
import { handleCreateResponse,
        handleGetResponse, 
        handleUpdateDeleteResponse } from "../utils/controllerUtils";
import IngredientModel from "../models/ingredientModel";

export async function createIngredientQuantity(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        quantity: joi.number().integer().greater(0).required(),
        ingredientID: joi.number().integer().greater(0).required()
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

        // check if unit exists
        const ingredientExists = await IngredientModel.exists(request.body.ingredientID);
        if (!ingredientExists) {
            response.status(400).json({
                message: RECORD_MISSING_MSG('Unit', request.body.ingredientID)
            });
            return;
        }
        const dbResponse = await IngredientQuantityModel.create(request.body.quantity,
                                                        request.body.ingredientID);
        const processedResponse = handleCreateResponse(dbResponse, 'IngredientQuantity');
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

export async function getIngredientQuantity(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = +request.params.ingredientQuantityId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 

        const dbResponse = await IngredientQuantityModel.get(id);
        const processedResponse = handleGetResponse(dbResponse, 
                                                    'ingredientQuantity', 
                                                    'IngredientQuantity');
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

export async function updateIngredientQuantity(request: Request,
                                        response: Response) : Promise<void> {
    const schema = joi.object({
        quantity: joi.number().integer().greater(0),
    });
    try {
        const id = +request.params.ingredientQuantityId;
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

        const updatedIngredientQuantity = {
            quantity: request.body.quantity
        } as IngredientQuantity;

        const dbResponse = await IngredientQuantityModel.update(id, updatedIngredientQuantity);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                             'Update', 
                                                             'IngredientQuantity');
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

export async function deleteIngredientQuantity(request: Request,
                                        response: Response) : Promise<void> {
    try {
        const id = +request.params.ingredientQuantityId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const dbResponse = await IngredientQuantityModel.delete(id);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                             'Delete', 
                                                             'IngredientQuantity');
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
