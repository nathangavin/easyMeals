import { createReturn, 
        getReturn, 
        getAllReturn,
        handleCreateRequest,
        handleDeleteRequest,
        handleGetAllRequest,
        handleGetRequest,
        handleUpdateRequest,
        updateDeleteReturn} from '../utils/databaseConnection';
import { StatusType } from '../utils/statusTypes';
import { UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export interface Instruction {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    description: string,
}

class InstructionModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('Instruction');

    static async create(description: string): 
                Promise<createReturn> {

        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const instruction = {
            createdTime,
            modifiedTime,
            description
        } as Instruction;
        return handleCreateRequest(instruction, 'Instructions', 'Instruction');
    }

    static async get(id: number): 
            Promise<getReturn<Instruction>> {
        return handleGetRequest(id, 'Instructions', 'Instruction');
    }

    static async getAll() : Promise<getAllReturn<Instruction>> {
        return handleGetAllRequest<Instruction>('Instructions', 
                                               'Instruction');
    }
    
    static async exists(id: number) : Promise<boolean> {
        const instructionResult = await this.get(id);
        return (instructionResult.status == StatusType.Success);
    }

    static async update(id: number, instruction: Instruction) : Promise<updateDeleteReturn> {
        return handleUpdateRequest<Instruction>(this.get,
                                            'Instructions',
                                            'Instruction',
                                            id,
                                            instruction);
    }

    static async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest<Instruction>(this.get,
                                            'Instructions',
                                            'Instruction',
                                            id);
    }
    
    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : InstructionModel.genericErrorMessage;
    }
} 

export default InstructionModel; 


