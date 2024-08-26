import { Request, Response } from "express";
import joi from "joi";
import IngredientModel from "../models/ingredientModel";
import { Status, StatusType } from "../utils/statusTypes";

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
                    message: 'Ingredient created succesfully', 
                    id: dbResponse.value 
                });
                break;
            case StatusType.Failure:
                response.status(500).json({
                    error: 'Internal Server Error',
                    message: dbResponse.message
                });
                break;
            case StatusType.Empty:
                response.status(404).json({
                    message: 'No results'
                });
                break;
            case StatusType.Missing:
                response.status(400).json({
                    error: 'Bad Request',
                    message: dbResponse.message
                });
                break;
            default:
                response.status(500).json({
                    error: 'Internal Server Error'
                });
        }
        
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

export async function getIngredient(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = +request.params.ingredientId;
        if (isNaN(id)) {
            response.status(400).json({
                error: 'Invalid Id Format'
            });
        } else {
            // get object from db
            const dbResponse : Status<StatusType, object | undefined>
                = await IngredientModel.get(id);

            switch (dbResponse.status) {
                case StatusType.Success: 
                    response.status(200).json({
                        data: dbResponse.value
                    });
                    break;
                case StatusType.Failure:
                    response.status(500).json({
                        error: 'Internal Server Error',
                        message: dbResponse.message
                    });
                    break;
                case StatusType.Empty:
                    response.status(404).json({
                        message: `record ${id} not found`
                    });
                    break;
                default: 
                    response.status(500).json({
                        error: 'Internal Server Error'
                    });
            }
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

