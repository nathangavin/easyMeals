import { Request, Response } from "express";
import joi from "joi";
import UnitModel from "../models/unitModel";
import { Status, StatusType } from "../utils/statusTypes";

export async function createUnit(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        desc: joi.string().alphanum().min(1).max(20).required()
    });

    try {
        // use the defined schema to validate the payload
        const { error, value } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                error: error.details[0].message
            });
        }
        
        const dbResponse : Status<StatusType, number | undefined> = await UnitModel.create(request.body.desc);
        
        switch (dbResponse.status) {
            case StatusType.Success:
                response.status(201).json({
                    message: 'Unit created succesfully', 
                    id: dbResponse.value 
                });
                break;
            case StatusType.Failure:
                response.status(500).json({
                    error: 'Internal Server Error',
                    message: dbResponse.message
                });
        }
        
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

export async function getUnit(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = request.params.unitId;
        // get object from db
        const data = { id };
        response.status(200).json({
            data: data
        })
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

