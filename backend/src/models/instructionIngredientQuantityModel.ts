import { createReturn, 
        getReturn, 
        getAllReturn,
        handleCreateRequest, 
        handleGetRequest, 
        handleUpdateRequest, 
        handleDeleteRequest,
        updateDeleteReturn, 
        handleGetAllRequest} from '../utils/databaseConnection';
import { UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';
import { StatusType } from '../utils/statusTypes';

export interface InstructionIngredientQuantity {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    quantityID: number,
    instructionID: number
};

class InstructionIngredientQuantityModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('InstructionIngredientQuantity');

    static async create(quantityID: number, instructionID: number): Promise<createReturn> {
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const instructionIngredientQuantity = {
            createdTime,
            modifiedTime,
            quantityID,
            instructionID
        } as InstructionIngredientQuantity;

        return handleCreateRequest<InstructionIngredientQuantity>(instructionIngredientQuantity, 
                                                       'InstructionIngredientQuantities', 
                                                       'InstructionIngredientQuantity');
    }

    static async get(id: number): Promise<getReturn<InstructionIngredientQuantity>> {
        return handleGetRequest<InstructionIngredientQuantity>(id, 
                                                    'InstructionIngredientQuantities', 
                                                    'InstructionIngredientQuantity');
    }

    static async getAll() : Promise<getAllReturn<InstructionIngredientQuantity>> {
        return handleGetAllRequest<InstructionIngredientQuantity>('InstructionIngredientQuantities', 
                                               'InstructionIngredientQuantity');
    }

    static async exists(id: number) : Promise<boolean> {
        const result = await this.get(id);
        return (result.status == StatusType.Success);
    }

    static async update(id: number, instructionIngredientQuantity: InstructionIngredientQuantity) : Promise<updateDeleteReturn> {
        return handleUpdateRequest<InstructionIngredientQuantity>(this.get,
                                               'InstructionIngredientQuantities',
                                               'InstructionIngredientQuantity',
                                               id,
                                               instructionIngredientQuantity);
    }

    static async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest(this.get,
                                    'InstructionIngredientQuantities',
                                    'InstructionIngredientQuantity',
                                    id);
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : InstructionIngredientQuantityModel.genericErrorMessage;
    }
} 

export default InstructionIngredientQuantityModel; 


