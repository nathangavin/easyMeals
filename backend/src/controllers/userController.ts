import { Request, Response } from "express";
import joi from "joi";

import UserModel, { User } from "../models/userModel";
import { StatusType } from "../utils/statusTypes";
import SessionModel, { TOKEN_LENGTH } from "../models/sessionModel";
import { AUTH_TOKEN_MALFORMED_MSG, 
        AUTH_TOKEN_MISSING_MSG, 
        AUTH_UNAUTHORISED_MSG, 
        INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG} from "../utils/messages";
import { handleAuthorization, handleCreateResponse, handleGetResponse, handleUpdateDeleteResponse } from "../utils/controllerUtils";

export async function createUser(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        firstname: joi.string().alphanum().min(1).max(20).required(),
        lastname: joi.string().alphanum().min(1).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().alphanum().min(16).max(256).required()
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

        const newUser = {
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            email: request.body.email
        } as User;
        
        const dbResponse = await UserModel.create(newUser, request.body.password);
        const processedResponse = handleCreateResponse(dbResponse, 'User');

        response.status(processedResponse.status).json(processedResponse.json);
        return;
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}

export async function getUser(request: Request,
                                response: Response): Promise<void> {
    try {
        // convert string to number with + unary operator
        const id = +request.params.userId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const dbResponse = await UserModel.get(id);
        const processedResponse = handleGetResponse(dbResponse, 'user', 'User');
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

export async function updateUser(request: Request, 
                                 response: Response): Promise<void> {

    const schema = joi.object({
        firstname: joi.string().alphanum().min(1).max(20),
        lastname: joi.string().alphanum().min(1).max(20),
    });

    try {
        // convert string to number with + unary operator
        const id = +request.params.userId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('Id')
            });
            return;
        } 
        const providedAuth = request.header('Authorization');
        const authResponse = await handleAuthorization(id, providedAuth);

        if (!authResponse.authorized) {
            response.status(authResponse.response.status)
                    .json(authResponse.response.json);
            return;
        }

        const { error } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                message: error.details[0].message
            });
            return;
        }
        
        const updatedUser = {
            firstname: request.body.firstname ?? null,
            lastname: request.body.lastname ?? null
        } as User;

        // request has been authenticated for this provided user
        const dbResponse = await UserModel.update(id, updatedUser);
        const processedResponse = handleUpdateDeleteResponse(dbResponse,
                                                            'UPDATE',
                                                            'User');
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

