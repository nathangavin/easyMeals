import { Request, Response } from "express";
import joi from "joi";
import IngredientModel, { Ingredient } from "../models/ingredientModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_MISSING_MSG } from "../utils/messages";
import { handleCreateResponse,
        handleGetResponse, 
        handleGetAllResponse,
        handleUpdateDeleteResponse } from "../utils/controllerUtils";
import UnitModel from "../models/unitModel";

export async function createIngredient(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        name: joi.string().alphanum().min(1).max(50).required(),
        unitID: joi.number().integer().greater(0).required()
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
        const unitExists = await UnitModel.exists(request.body.unitID);
        if (!unitExists) {
            response.status(400).json({
                message: RECORD_MISSING_MSG('Unit', request.body.unitID)
            });
            return;
        }
        const dbResponse = await IngredientModel.create(request.body.name,
                                                        request.body.unitID);
        const processedResponse = handleCreateResponse(dbResponse, 'Ingredient');
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

export async function getIngredient(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = +request.params.ingredientId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 

        const dbResponse = await IngredientModel.get(id);
        const processedResponse = handleGetResponse(dbResponse, 'ingredient', 'Ingredient');
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

export async function getAllIngredients(request: Request,
                                    response: Response) : Promise<void> {
    try {
        // get objects from db
        const dbResponse = await IngredientModel.getAll();
        console.log(dbResponse);
        const processedResponse = handleGetAllResponse(dbResponse,
                                                   'ingredients',
                                                   'Ingredient');
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

export async function updateIngredient(request: Request,
                                        response: Response) : Promise<void> {
    const schema = joi.object({
        name: joi.string().alphanum().min(1).max(50)
    });
    try {
        const id = +request.params.ingredientId;
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

        const updatedIngredient = {
            name: request.body.name
        } as Ingredient;

        const dbResponse = await IngredientModel.update(id, updatedIngredient);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                             'Update', 
                                                             'Ingredient');
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

export async function deleteIngredient(request: Request,
                                        response: Response) : Promise<void> {
    try {
        const id = +request.params.ingredientId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const dbResponse = await IngredientModel.delete(id);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                             'Delete', 
                                                             'Ingredient');
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
