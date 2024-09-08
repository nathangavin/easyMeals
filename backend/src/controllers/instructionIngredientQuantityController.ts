import { Request, Response } from "express";
import joi from "joi";
import InstructionIngredientQuantityModel from "../models/instructionIngredientQuantityModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_MISSING_MSG } from "../utils/messages";
import { handleCreateResponse,
        handleGetResponse, 
        handleGetAllResponse,
        handleUpdateDeleteResponse } from "../utils/controllerUtils";
import IngredientQuantityModel from "../models/ingredientQuantityModel";
import InstructionModel from "../models/instructionModel";

export async function createInstructionIngredientQuantity(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        quantityID: joi.number().integer().greater(0).required(),
        instructionID: joi.number().integer().greater(0).required()
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
        // check if instruction exists
        const instructionExists = await InstructionModel.exists(request.body.instructionID);
        if (!instructionExists) {
            response.status(400).json({
                message: RECORD_MISSING_MSG('Unit', request.body.instructionID)
            });
            return;
        }
        const dbResponse = await InstructionIngredientQuantityModel.create(
                                                        request.body.quantityID,
                                                        request.body.instructionID);
        const processedResponse = handleCreateResponse(dbResponse, 'InstructionIngredientQuantity');
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

export async function getInstructionIngredientQuantity(request: Request,
                                        response: Response): Promise<void> {
    try {
        const id = +request.params.instructionIngredientQuantityId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 

        const dbResponse = await InstructionIngredientQuantityModel.get(id);
        const processedResponse = handleGetResponse(dbResponse, 
                                                    'instructionIngredientQuantity', 
                                                    'InstructionIngredientQuantity');
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

export async function getAllInstructionIngredientQuantities(request: Request,
                                        response: Response): Promise<void> {
    try {
        const dbResponse = await InstructionIngredientQuantityModel.getAll();
        const processedResponse = handleGetAllResponse(dbResponse, 
                                                    'instructionIngredientQuantities', 
                                                    'InstructionIngredientQuantities');
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
export async function updateInstructionIngredientQuantity(request: Request,
                                        response: Response) : Promise<void> {
    response.status(405).json();
}

export async function deleteInstructionIngredientQuantity(request: Request,
                                        response: Response) : Promise<void> {
    try {
        const id = +request.params.instructionIngredientQuantityId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const dbResponse = await InstructionIngredientQuantityModel.delete(id);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                             'Delete', 
                                                             'InstructionIngredientQuantity');
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
