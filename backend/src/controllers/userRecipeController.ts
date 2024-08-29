import { Request, Response } from "express";
import joi from "joi";
import { StatusType } from "../utils/statusTypes";
import UserRecipeModel from "../models/userRecipeModel";
import UserModel from "../models/userModel";
import RecipeModel from "../models/recipeModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_CREATED_SUCCESSFULLY_MSG, 
        RECORD_MISSING_MSG, 
        UNREACHABLE_CODE_UNKNOWN_STATUS_MSG} from "../utils/messages";
import { handleCreateResponse } from "../utils/controllerUtils";

export async function createUserRecipe(request: Request, 
                                 response: Response): Promise<void> {

    const schema = joi.object({
        rating: joi.number().integer().greater(0).less(11).required(),
        userID: joi.number().integer().greater(0).required(),
        recipeID: joi.number().integer().greater(0).required(),
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

        // check if user exists
        const userdDbResponse = await UserModel.get(request.body.userID);
        switch (userdDbResponse.status) {
            case StatusType.Missing:
                response.status(400).json({
                    message: RECORD_MISSING_MSG('User', request.body.userID)
                });
                return;
            case StatusType.Failure:
                response.status(500).json({
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: userdDbResponse.message
                });
                return;
        }

        // check if recipe exists
        const recipeDbResponse = await RecipeModel.get(request.body.recipeID);
        switch (recipeDbResponse.status) {
            case StatusType.Missing:
                response.status(400).json({
                    message: RECORD_MISSING_MSG('Recipe', request.body.recipeID)
                });
                return;
            case StatusType.Failure:
                response.status(500).json({
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: recipeDbResponse.message
                });
                return;
        }
        
        const dbResponse = await UserRecipeModel.create(request.body.userID, 
                                                        request.body.recipeID,
                                                        request.body.rating);
        const processedResponse = handleCreateResponse(dbResponse, 'UserRecipe');

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

export async function getUserRecipe(request: Request, 
                                 response: Response): Promise<void> {
    try {
        // convert string to number with + unary operator
        const id = +request.params.userRecipeId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        // get object from db
        const dbResponse = await UserRecipeModel.get(id);

        switch (dbResponse.status) {
            case StatusType.Success: 
                response.status(200).json({
                    user: dbResponse.value
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
                    message: RECORD_MISSING_MSG('UserRecipe', id.toString())
                });
                return;
            default: 
                response.status(500).json({
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('UserRecipe', 'Get')
                });
                return;
        }
    } catch (err) {
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}
