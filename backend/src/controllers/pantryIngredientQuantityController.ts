import { Request, Response } from "express";
import joi from "joi";
import PantryIngredientQuantityModel from "../models/pantryIngredientQuantityModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_MISSING_MSG } from "../utils/messages";
import { handleCreateResponse,
        handleGetResponse, 
        handleGetAllResponse,
        handleUpdateDeleteResponse } from "../utils/controllerUtils";
import IngredientQuantityModel from "../models/ingredientQuantityModel";
import PantryModel from "../models/pantryModel";

export async function createPantryIngredientQuantity(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        quantityID: joi.number().integer().greater(0).required(),
        pantryID: joi.number().integer().greater(0).required()
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

        // check if quantity exists
        const quantityExists = await IngredientQuantityModel.exists(request.body.quantityID);
        if (!quantityExists) {
            response.status(400).json({
                message: RECORD_MISSING_MSG('Unit', request.body.quantityID)
            });
            return;
        }
        // check if pantry exists
        const pantryExists = await PantryModel.exists(request.body.pantryID);
        if (!pantryExists) {
            response.status(400).json({
                message: RECORD_MISSING_MSG('Unit', request.body.pantryID)
            });
            return;
        }
        const dbResponse = await PantryIngredientQuantityModel.create(
                                                        request.body.quantityID,
                                                        request.body.pantryID);
        const processedResponse = handleCreateResponse(dbResponse, 'PantryIngredientQuantity');
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

export async function getPantryIngredientQuantity(request: Request,
                                        response: Response): Promise<void> {
    try {
        const id = +request.params.pantryIngredientQuantityId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 

        const dbResponse = await PantryIngredientQuantityModel.get(id);
        const processedResponse = handleGetResponse(dbResponse, 
                                                    'pantryIngredientQuantity', 
                                                    'PantryIngredientQuantity');
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

export async function getAllPantryIngredientQuantities(request: Request,
                                        response: Response): Promise<void> {
    try {
        const dbResponse = await PantryIngredientQuantityModel.getAll();
        const processedResponse = handleGetResponse(dbResponse, 
                                                    'pantryIngredientQuantities', 
                                                    'PantryIngredientQuantities');
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

export async function updatePantryIngredientQuantity(request: Request,
                                        response: Response) : Promise<void> {
    response.status(405).json();
}

export async function deletePantryIngredientQuantity(request: Request,
                                        response: Response) : Promise<void> {
    try {
        const id = +request.params.pantryIngredientQuantityId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const dbResponse = await PantryIngredientQuantityModel.delete(id);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                             'Delete', 
                                                             'PantryIngredientQuantity');
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
