import { Request, Response } from "express";
import joi from "joi";
import PantryModel from "../models/pantryModel";
import { StatusType } from "../utils/statusTypes";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_CREATED_SUCCESSFULLY_MSG, 
        UNREACHABLE_CODE_UNKNOWN_STATUS_MSG } from "../utils/messages";

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
                error: error.details[0].message
            });
            return;
        }
        
        const dbResponse = await PantryModel.create(request.body.desc);
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success:
                response.status(201).json({
                    message: RECORD_CREATED_SUCCESSFULLY_MSG('Pantry'),
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
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('Pantry', 
                                                                 'CREATE', 
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

export async function getPantry(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = +request.params.pantryId;
        if (isNaN(id)) {
            response.status(400).json({
                error: INVALID_PARAM_MSG('ID')
            });
            return;
        } else {
            // get object from db
            const dbResponse = await PantryModel.get(id);

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
                        message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('Pantry', 'GET')
                    });
                    return;
            }
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}

