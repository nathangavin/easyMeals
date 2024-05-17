import { Request, Response } from "express";
import joi from "joi";

import UserModel from "../models/userModel";
import { Status, StatusType } from "../utils/statusTypes";
import { generateToken } from "../utils/tokens";

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
        
        const dbResponse : Status<StatusType, number | undefined> = 
                                await UserModel.create(request.body.firstname,
                                                       request.body.lastname,
                                                       request.body.email,
                                                       request.body.password);
        console.log(dbResponse);
        switch (dbResponse.status) {
            case StatusType.Success:
                response.status(201).json({
                    message: 'User created succesfully', 
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
        const id = +request.params.unitId;
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
                        data: dbResponse.value
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

export async function login(request: Request,
                           response: Response): Promise<void> {
    
    const schema = joi.object({
        email: joi.string().alphanum().min(1).max(100).required(),
        password: joi.string().alphanum().min(16).max(256).required()
    });

    try {
        const { error, value } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                error: error.details[0].message
            });
        }

        const userDbResponse : Status<StatusType, string | undefined> 
                = await UserModel.login(request.body.email, request.body.password);
        
        switch (userDbResponse.status) {
            case StatusType.Empty:
                response.status(400).json({
                    error: 'User does not exist'
                });
                break;
            case StatusType.Missing:
                response.status(401).json({
                    error: 'Incorrect Password'
                });
                break;
            case StatusType.Success:
                response.status(200).json({
                    token: userDbResponse.value
                });
                break;
            default:
                response.status(500).json({
                    error: 'Internal Server Error'
                });
                break;
        }
        return;
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

