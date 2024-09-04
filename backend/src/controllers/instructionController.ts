import { Request, Response } from "express";
import joi from "joi";
import InstructionModel, { Instruction } from "../models/instructionModel";
import { INTERNAL_SERVER_ERROR_MSG, 
        INVALID_PARAM_MSG } from "../utils/messages";
import { handleCreateResponse, 
        handleGetResponse, 
        handleUpdateDeleteResponse } from "../utils/controllerUtils";

export async function createInstruction(request: Request, 
                                 response: Response): Promise<void> {
    const schema = joi.object({
        description: joi.string().alphanum().min(1).max(256).required(),
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
        
        const dbResponse = await InstructionModel.create(request.body.description);
        const processedResponse = handleCreateResponse(dbResponse, 'Instruction');
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

export async function getInstruction(request: Request,
                                response: Response): Promise<void> {
    try {
        const id = +request.params.instructionId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 

        const dbResponse = await InstructionModel.get(id);
        const processedResponse = handleGetResponse(dbResponse, 'instruction', 'Instruction');
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

export async function updateInstruction(request: Request,
                                            response: Response) : Promise<void> {
    const schema = joi.object({
        description: joi.string().alphanum().min(1).max(256).required(),
    });
    try {
        const id = +request.params.instructionId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 
        const { error } = schema.validate(request.body);
        if (error) {
            response.status(400).json({
                message: error.details[0].message
            });
            return;
        }
        const updatedInstruction = {
            description: request.body.description
        } as Instruction;
        const dbResponse = await InstructionModel.update(id, updatedInstruction);
        const processedResponse = handleUpdateDeleteResponse(dbResponse, 'Update', 'Instruction');
        response.status(processedResponse.status)
                .json(processedResponse.json);

    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: INTERNAL_SERVER_ERROR_MSG,
            message: err
        });
    }
}

export async function deleteInstruction(request: Request,
                                            response: Response) : Promise<void> {
    try {
        const id = +request.params.instructionId;
        if (isNaN(id)) {
            response.status(400).json({
                message: INVALID_PARAM_MSG('ID')
            });
            return;
        } 

        const dbResponse = await InstructionModel.delete(id);
        const processedResponse = handleUpdateDeleteResponse(dbResponse, 'Delete', 'Instruction');
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
