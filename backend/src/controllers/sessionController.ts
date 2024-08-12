import { Request, Response } from "express";
import joi from "joi";

import SessionModel, { TOKEN_LENGTH } from "../models/sessionModel";
import { Status, StatusType } from "../utils/statusTypes";
import UserModel from "../models/userModel";

export async function createSession(request: Request,
                           response: Response): Promise<void> {
    
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().alphanum().min(16).max(256).required()
    });

    try {
        const { error, value } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                error: error.details[0].message
            });
        }

        const userLoginResponse = 
                await UserModel.login(request.body.email, request.body.password);

        switch (userLoginResponse.status) {
            case StatusType.Failure:
                response.status(400).json({
                    error: userLoginResponse.message
                });
                return;
            case StatusType.Missing: 
                response.status(401).json({
                    error: userLoginResponse.message
                });
                return;
            case StatusType.Empty:
                response.status(404).json({
                    error: 'User not found'
                });
                return;
            case StatusType.Success:
                if (userLoginResponse.value) {
                    const sessionDbResponse = 
                        await SessionModel.get(userLoginResponse.value);
                    switch (sessionDbResponse.status) {
                        case StatusType.Success:
                            if (sessionDbResponse.value) {
                                response.status(200).json({
                                    session: sessionDbResponse.value.token
                                });
                            }
                            return;
                        case StatusType.Empty:
                            response.status(400).json({
                                error: 'Session does not exist'
                            });
                            return;
                        case StatusType.Failure:
                            response.status(500).json({
                                error: 'Internal Session Error'
                            });
                            return;
                        default:
                            response.status(500).json({
                                error: 'Internal Server Error'
                            });
                            return;
                    }
                }
                
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

export async function getSession(request: Request,
                                response: Response): Promise<void> {

    try {
        // convert string to number with + unary operator
        if (request.params.sessionID.length > 70) {
            const session = request.params.sessionID;
            if (session.length != 100) {
                response.status(400).json({
                    error: 'Invalid Session length'
                });
            } else {
                const dbResponse = await SessionModel.getByToken(session);
                console.log(dbResponse);
                switch (dbResponse.status) {
                    case StatusType.Success: 
                        response.status(200).json({
                        session: dbResponse.value
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
                            message: `record ${session} not found`
                        });
                        break;
                }
            }
        } else {
            const id = +request.params.sessionID;
            if (isNaN(id)) {
                response.status(400).json({
                    error: 'Invalid Id Format'
                });
            } else {
                // get object from db
                const dbResponse = await SessionModel.get(id);

                switch (dbResponse.status) {
                    case StatusType.Success: 
                        response.status(200).json({
                        session: dbResponse.value
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
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

export async function logout(request: Request,
                            response: Response): Promise<void> {
    try {
        // convert string to number with + unary operator
        if (request.params.sessionToken.length != TOKEN_LENGTH) {
            response.status(400).json({
                error: 'Invalid Session length'
            });
        } else {
            const session = request.params.sessionToken;
            console.log(session);
            const dbResponse = await SessionModel.delete(session);
            console.log(dbResponse);
            switch (dbResponse.status) {
                case StatusType.Success: 
                    console.log('aaa');
                    response.status(204).json();
                    return;
                case StatusType.Failure:
                    response.status(500).json({
                        error: 'Internal Server Error',
                        message: dbResponse.message
                    });
                    return;
                case StatusType.Empty:
                    response.status(404).json({
                        message: `record ${session} not found`
                    });
                    return;
                default:
                    response.status(500).json({
                        error: 'Internal Server Error'
                    });
                    return;
            }
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}
