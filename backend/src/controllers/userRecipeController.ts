import { Request, Response } from "express";
import joi from "joi";
import IngredientModel from "../models/ingredientModel";
import { Status, StatusType } from "../utils/statusTypes";
import UserRecipeModel from "../models/userRecipeModel";
import UserModel from "../models/userModel";
import RecipeModel from "../models/recipeModel";

export async function createUserRecipe(request: Request, 
                                 response: Response): Promise<void> {

    const schema = joi.object({
        rating: joi.number().integer().greater(0).less(11).required(),
        userID: joi.number().integer().greater(0).required(),
        recipeID: joi.number().integer().greater(0).required(),
    });

    try {
        // use the defined schema to validate the payload
        const { error, value } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                error: error.details[0].message
            });
        }

        // check if user exists
        const userRequest = await UserModel.get(request.body.userID);
        switch (userRequest.status) {
            case StatusType.Empty:
                response.status(400).json({
                    message: `User record ${request.body.userID} not found`
                });
                return;
            case StatusType.Failure:
                response.status(500).json({
                    message: 'Internal Server Error'
                });
                return;
        }

        // check if recipe exists
        const recipeRequest = await RecipeModel.get(request.body.recipeID);
        switch (recipeRequest.status) {
            case StatusType.Empty:
                response.status(400).json({
                    message: `Recipe record ${request.body.recipeID} not found`
                });
                return;
            case StatusType.Failure:
                response.status(500).json({
                    message: 'Internal Server Error' 
                });
                return;
        }
        
        const dbResponse = await UserRecipeModel.create(request.body.userID, 
                                                        request.body.recipeID,
                                                        request.body.rating);
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success:
                response.status(201).json({
                    message: 'UserRecipe created successfully', 
                    id: dbResponse.value 
                });
                return;
            case StatusType.Failure:
                response.status(500).json({
                    error: 'Internal Server Error',
                    message: dbResponse.message
                });
                return;
            default:
                response.status(500).json({
                    error: 'Internal Server Error',
                    message: 'Unknown error' 
                });
                return;
        }
        
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
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
                error: 'Invalid Id Format'
            });
        } else {
            // get object from db
            const dbResponse = await UserRecipeModel.get(id);

            switch (dbResponse.status) {
                case StatusType.Success: 
                    response.status(200).json({
                    user: dbResponse.value
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
        response.status(500).json({
            error: 'Internal Server Error',
            message: err
        });
    }
}
