import { Request, Response } from "express";
import joi from "joi";

import UserModel, { User } from "../models/userModel";
import { StatusType } from "../utils/statusTypes";
import SessionModel, { TOKEN_LENGTH } from "../models/sessionModel";
import { AUTH_TOKEN_MALFORMED_MSG, 
        AUTH_TOKEN_MISSING_MSG, 
        AUTH_UNAUTHORISED_MSG, 
        INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        RECORD_CREATED_SUCCESSFULLY_MSG, 
        UNREACHABLE_CODE_UNKNOWN_STATUS_MSG} from "../utils/messages";

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
                error: error.details[0].message
            });
        }

        const newUser = {
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            email: request.body.email
        } as User;
        
        const dbResponse = await UserModel.create(newUser, request.body.password);
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success:
                response.status(201).json({
                    message: RECORD_CREATED_SUCCESSFULLY_MSG('User'),
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
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('User', 
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

export async function getUser(request: Request,
                                response: Response): Promise<void> {
    try {
        // convert string to number with + unary operator
        const id = +request.params.userId;
        if (isNaN(id)) {
            response.status(400).json({
                error: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        // get object from db
        const dbResponse = await UserModel.get(id);

        switch (dbResponse.status) {
            case StatusType.Success: 
                response.status(200).json({
                    user: dbResponse.value
                });
                return;
            case StatusType.Missing:
                response.status(404).json({
                    message: dbResponse.message
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
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('User', 'Get')
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

export async function updateUser(request: Request, 
                                 response: Response): Promise<void> {

    const schema = joi.object({
        firstname: joi.string().alphanum().min(1).max(20),
        lastname: joi.string().alphanum().min(1).max(20),
    });

    try {
        const providedAuth = request.header('Authorization');
        if (!providedAuth) {
            response.status(401).json({
                message: AUTH_TOKEN_MISSING_MSG
            });
            return;
        }
        if (providedAuth.split(' ').length < 2) {
            response.status(401).json({
                message: AUTH_TOKEN_MALFORMED_MSG
            });
            return;
        }
        const session = providedAuth.split(' ')[1];
        if (session.length != TOKEN_LENGTH) {
            response.status(401).json({
                message: AUTH_TOKEN_MALFORMED_MSG
            });
            return;
        }

        // convert string to number with + unary operator
        const id = +request.params.userId;
        if (isNaN(id)) {
            response.status(400).json({
                error: INVALID_PARAM_MSG('Id')
            });
            return;
        } 

        // determine if session token allows for user to be edited
        const sessionDbResponse = await SessionModel.getByToken(session);

        if (sessionDbResponse.status != StatusType.Success) {
            response.status(401).json({
                message: AUTH_UNAUTHORISED_MSG
            });
            return;
        }

        if (sessionDbResponse.value?.UserID != id) {
            response.status(401).json({
                message: AUTH_UNAUTHORISED_MSG
            });
            return;
        }

        const { error } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                error: error.details[0].message
            });
        }
        
        const updatedUser = {
            firstname: request.body.firstname ?? null,
            lastname: request.body.lastname ?? null
        } as User;

        // request has been authenticated for this provided user
        const dbResponse = await UserModel.update(id, updatedUser);

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
                message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG('User','Update')
            })
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}

