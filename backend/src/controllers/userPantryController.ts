import { Request, Response } from "express";
import joi from "joi";
import { StatusType } from "../utils/statusTypes";
import UserPantryModel from "../models/userPantryModel";
import UserModel from "../models/userModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_MISSING_MSG } from "../utils/messages";
import { handleAuthorization, 
        handleCreateResponse, 
        handleGetResponse, 
        handleUpdateDeleteResponse } from "../utils/controllerUtils";
import PantryModel from "../models/pantryModel";

export async function createUserPantry(request: Request, 
                                 response: Response): Promise<void> {

    const schema = joi.object({
        userID: joi.number().integer().greater(0).required(),
        pantryID: joi.number().integer().greater(0).required(),
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

        // check if user exists
        const userExists = await UserModel.exists(request.body.userID);
        if (!userExists) {
            response.status(400).json({
                message: RECORD_MISSING_MSG('User', request.body.userID)
            });
            return;
        }
        // check if pantry exists
        const pantryExists = await PantryModel.exists(request.body.pantryID);
        if (!pantryExists) {
            response.status(400).json({
                message: RECORD_MISSING_MSG('Pantry', request.body.pantryID)
            });
            return;
        }
        
        const dbResponse = await UserPantryModel.create(request.body.userID, 
                                                        request.body.pantryID);
        const processedResponse = handleCreateResponse(dbResponse, 'UserPantry');

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

export async function getUserPantry(request: Request, 
                                 response: Response): Promise<void> {
    try {
        // convert string to number with + unary operator
        const id = +request.params.userPantryId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        
        // get object from db
        const dbResponse = await UserPantryModel.get(id);
        const processedResponse = handleGetResponse(dbResponse,
                                                   'userPantry',
                                                   'UserPantry');
        response.status(processedResponse.status)
                .json(processedResponse.json);
        return;
    } catch (err) {
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}

export async function updateUserPantry(request: Request,
                                      response: Response) : Promise<void> {
    response.status(405).json();
}

export async function deleteUserPantry(request: Request,
                                      response: Response) : Promise<void> {

    try {
        const id = +request.params.userPantryId;
        if (isNaN(id)) {
            response.status(500).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        }

        // retreive userid from userPantry to determine authorisation
        const getDbResponse = await UserPantryModel.get(id);
        if (getDbResponse.status != StatusType.Success ||
                !getDbResponse.value) {
            const processedResponse = handleGetResponse(getDbResponse, 
                                                        'userPantry',
                                                        'UserPantry');
            response.status(processedResponse.status)
                    .json(processedResponse.json);
            return;
        }
        
        const userId = getDbResponse.value.userID;

        const providedAuth = request.header('Authorization');
        const authResponse = await handleAuthorization(userId, providedAuth);

        if (!authResponse.authorized) {
            response.status(authResponse.response.status)
                    .json(authResponse.response.json);
            return;
        }
        
        const dbResponse = await UserPantryModel.delete(id);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                            'DELETE',
                                                            'UserPantry');
        response.status(processedResponse.status)
                .json(processedResponse.json);
        return;
    } catch (err) {
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}
