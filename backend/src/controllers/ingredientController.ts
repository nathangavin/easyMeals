import { Request, Response } from "express";
import joi from "joi";
import IngredientModel from "../models/ingredientModel";
import { Status, StatusType } from "../utils/statusTypes";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_CREATED_SUCCESSFULLY_MSG, 
        UNREACHABLE_CODE_MSG, 
        UNREACHABLE_CODE_UNKNOWN_STATUS_MSG } from "../utils/messages";

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
                error: error.details[0].message
            });
            return;
        }
        
        const dbResponse = await IngredientModel.create(request.body.desc);
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success:
                response.status(201).json({
                    message: RECORD_CREATED_SUCCESSFULLY_MSG('Ingredient'),
                    id: dbResponse.value 
                });
                return;
            case StatusType.Failure:
                response.status(500).json({
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: dbResponse.message
                });
                return;
            default:
                response.status(500).json({
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('Ingredient', 
                                                                 'Create', 
                                                                 dbResponse.status)
                });
                return;
        }
        
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

        switch (dbResponse.status) {
            case StatusType.Success: 
                response.status(200).json({
                    data: dbResponse.value
                });
                return;
            case StatusType.Failure:
                response.status(500).json({
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: dbResponse.message
                });
                return;
            case StatusType.Missing:
                response.status(404).json({
                    message: dbResponse.message
                });
                return;
            default: 
                response.status(500).json({
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: `${UNREACHABLE_CODE_MSG} - Ingredient Get - Unknown Status`
                });
                return;
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}

