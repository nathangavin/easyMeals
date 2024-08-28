import { Request, Response } from "express";
import joi from "joi";
import RecipeModel, { Recipe } from "../models/recipeModel";
import { StatusType } from "../utils/statusTypes";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_CREATED_SUCCESSFULLY_MSG, 
        UNREACHABLE_CODE_UNKNOWN_STATUS_MSG} from "../utils/messages";

export async function createRecipe(request: Request, 
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
        }
        
        const dbResponse = await RecipeModel.create(request.body.name);
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success:
                response.status(201).json({
                    message: RECORD_CREATED_SUCCESSFULLY_MSG('Recipe'), 
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
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('Recipe', 
                                                                 'Create', 
                                                                 dbResponse.status)
                });
                return;
        }
        
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG
        });
    }
}

export async function getRecipe(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = +request.params.recipeId;
        if (isNaN(id)) {
            response.status(400).json({
                error: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        // get object from db
        const dbResponse = await RecipeModel.get(id);

        switch (dbResponse.status) {
            case StatusType.Success: 
                response.status(200).json({
                    recipe: dbResponse.value
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
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}

export async function updateRecipe(request: Request, 
                                    response: Response) : Promise<void> {
    
    const schema = joi.object({
        name: joi.string().alphanum().min(1).max(20),
        draftFlag: joi.boolean()
    });
    try {
        const id = +request.params.recipeId;
        if (isNaN(id)) {
            response.status(400).json({
                error: INVALID_PARAM_MSG('ID')
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
        
        const updatedRecipe = {
            name: request.body.name ?? null,
            draftFlag: request.body.draftFlag ?? null
        } as Recipe;
        
        const dbResponse = await RecipeModel.update(id, updatedRecipe);

        switch (dbResponse.status) {
            case StatusType.Success: 
                response.status(204).json();
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
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('Recipe','Update')
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

export async function deleteRecipe(request: Request,
                                    response: Response) : Promise<void> {

    try {
        const id = +request.params.recipeId;
        if (isNaN(id)) {
            response.status(400).json({
                error: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const dbResponse = await RecipeModel.delete(id);
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success: 
                response.status(204).json();
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
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('Recipe', 'Delete')
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

