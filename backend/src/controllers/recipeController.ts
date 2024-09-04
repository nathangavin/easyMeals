import { Request, Response } from "express";
import joi from "joi";
import RecipeModel, { Recipe } from "../models/recipeModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG } from "../utils/messages";
import { handleCreateResponse, 
        handleGetResponse, 
        handleUpdateDeleteResponse } from "../utils/controllerUtils";

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
                message: error.details[0].message
            });
        }
        
        const dbResponse = await RecipeModel.create(request.body.name);
        const processedResponse = handleCreateResponse(dbResponse, 'Recipe');
        response.status(processedResponse.status)
                .json(processedResponse.json);
        return;

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
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        // get object from db
        const dbResponse = await RecipeModel.get(id);

        const processedResponse = handleGetResponse(dbResponse, 'recipe', 'Recipe');

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
        
        const updatedRecipe = {
            name: request.body.name ?? null,
            draftFlag: request.body.draftFlag ?? null
        } as Recipe;
        
        const dbResponse = await RecipeModel.update(id, updatedRecipe);
        
        const processedResponse = handleUpdateDeleteResponse(dbResponse, 
                                                             'Update',
                                                             'Recipe');
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

export async function deleteRecipe(request: Request,
                                    response: Response) : Promise<void> {

    try {
        const id = +request.params.recipeId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const dbResponse = await RecipeModel.delete(id);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                            'Delete',
                                                            'Recipe');

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

