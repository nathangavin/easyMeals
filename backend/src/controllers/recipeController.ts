import { Request, Response } from "express";
import joi from "joi";
import RecipeModel from "../models/recipeModel";
import { Status, StatusType } from "../utils/statusTypes";

export async function createRecipe(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        name: joi.string().alphanum().min(1).max(20).required()
    });

    try {
        // use the defined schema to validate the payload
        const { error, value } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                error: error.details[0].message
            });
        }
        
        const dbResponse : Status<StatusType, number | undefined> = 
                                    await RecipeModel.create(request.body.desc);
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success:
                response.status(201).json({
                    message: 'Recipe created succesfully', 
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
        }
        
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

export async function getRecipe(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = +request.params.pantryId;
        if (isNaN(id)) {
            response.status(400).json({
                error: 'Invalid Id Format'
            });
        } else {
            // get object from db
            const dbResponse : Status<StatusType, object | undefined>
                = await RecipeModel.get(id);

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
            }
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

