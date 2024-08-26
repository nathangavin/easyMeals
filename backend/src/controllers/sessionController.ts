import { Request, Response } from "express";
import joi from "joi";

import SessionModel, { TOKEN_LENGTH } from "../models/sessionModel";
import { StatusType } from "../utils/statusTypes";
import UserModel from "../models/userModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG, 
        UNREACHABLE_CODE_MSG } from "../utils/messages";

export async function createSession(request: Request,
                           response: Response): Promise<void> {
    
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().alphanum().min(16).max(256).required()
    });

    try {
        const { error } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                error: error.details[0].message
            });
        }

        const userLoginResponse = 
                await UserModel.login(request.body.email, request.body.password);

        if (userLoginResponse.status != StatusType.Success) {
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
            }
        }
        if (!userLoginResponse.value) {
            // should be unreachable, so if code reaches here
            response.status(500).json({
                error: INTERNAL_SERVER_ERROR_MSG,
                message: `${UNREACHABLE_CODE_MSG} - user login response`
            });
            return;
        }
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
            case StatusType.Failure:
                response.status(500).json({
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: sessionDbResponse.message
                });
                return;
            case StatusType.Missing: 
                response.status(404).json({
                    message: sessionDbResponse.message
                });
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}

export async function getSession(request: Request,
                                response: Response): Promise<void> {

    try {
        let dbResponse;
        if (request.params.sessionID.length > 70) {
            // handle if session token is provided
            const session = request.params.sessionID;
            if (session.length != 100) {
                response.status(400).json({
                    error: INVALID_PARAM_MSG('Token')
                });
                return;
            } 
            dbResponse = await SessionModel.getByToken(session);
        } else {
            // handle if session ID is provided
            const id = +request.params.sessionID;
            if (isNaN(id)) {
                response.status(400).json({
                    error: INVALID_PARAM_MSG('ID')
                });
                return;
            } 
            dbResponse = await SessionModel.get(id);
        }
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success: 
                response.status(200).json({
                    session: dbResponse.value
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

export async function logout(request: Request,
                            response: Response): Promise<void> {
    try {
        if (request.params.sessionToken.length != TOKEN_LENGTH) {
            response.status(400).json({
                error: INVALID_PARAM_MSG('Token') 
            });
            return;
        } 
        const session = request.params.sessionToken;
        const dbResponse = await SessionModel.delete(session);
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
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}
