import { Request, Response } from "express";
import joi from "joi";

import UserModel, { User } from "../models/userModel";
import { Status, StatusType } from "../utils/statusTypes";
import SessionModel, { TOKEN_LENGTH } from "../models/sessionModel";
import { todo } from "node:test";

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
        const { error, value } = schema.validate(request.body);
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
        
        const dbResponse : Status<StatusType, number | undefined> = 
                                await UserModel.create(newUser, 
                                                       request.body.password);
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success:
                response.status(201).json({
                    message: 'User created successfully', 
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

export async function getUser(request: Request,
                                response: Response): Promise<void> {
    try {
        // convert string to number with + unary operator
        const id = +request.params.userId;
        if (isNaN(id)) {
            response.status(400).json({
                error: 'Invalid Id Format'
            });
        } else {
            // get object from db
            const dbResponse : Status<StatusType, object | undefined>
                = await UserModel.get(id);

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
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
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
                message: 'Authentication not provided'
            });
            return;
        }
        if (providedAuth.split(' ').length < 2) {
            response.status(401).json({
                message: 'Authentication malformed'
            });
            return;
        }
        const session = providedAuth.split(' ')[1];
        if (session.length != TOKEN_LENGTH) {
            response.status(401).json({
                message: 'Authentication malformed'
            });
            return;
        }

        // convert string to number with + unary operator
        const id = +request.params.userId;
        if (isNaN(id)) {
            response.status(400).json({
                error: 'Invalid ID Format'
            });
            return;
        } 

        // determine if session token allows for user to be edited
        const sessionDbResponse = await SessionModel.getByToken(session);

        if (sessionDbResponse.status != StatusType.Success) {
            response.status(401).json({
                message: 'invalid session token'
            });
            return;
        }

        if (sessionDbResponse.value?.UserID != id) {
            response.status(401).json({
                message: 'Unauthorized'
            });
            return;
        }

        const { error, value } = schema.validate(request.body);
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
        todo();

        // get object from db
        const dbResponse : Status<StatusType, object | undefined>
            = await UserModel.get(id);

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
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

