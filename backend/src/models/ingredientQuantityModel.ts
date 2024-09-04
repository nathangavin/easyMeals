import { createReturn, 
        getReturn, 
        handleCreateRequest, 
        handleGetRequest, 
        handleUpdateRequest, 
        handleDeleteRequest,
        updateDeleteReturn } from '../utils/databaseConnection';
import { UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';
import { StatusType } from '../utils/statusTypes';

export interface IngredientQuantity {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    ingredientID: number,
    quantity: number
};

class IngredientQuantityModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('IngredientQuantity');

    static async create(quantity: number, ingredientID: number): Promise<createReturn> {
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const ingredientQuantity = {
            createdTime,
            modifiedTime,
            quantity,
            ingredientID
        } as IngredientQuantity;
        return handleCreateRequest<IngredientQuantity>(ingredientQuantity, 
                                                       'IngredientQuantities', 
                                                       'IngredientQuantity');
    }

    static async get(id: number): Promise<getReturn<IngredientQuantity>> {
        return handleGetRequest<IngredientQuantity>(id, 
                                                    'IngredientQuantities', 
                                                    'IngredientQuantity');
    }

    static async exists(id: number) : Promise<boolean> {
        const result = await this.get(id);
        return (result.status == StatusType.Success);
    }

    static async update(id: number, ingredientQuantity: IngredientQuantity) : Promise<updateDeleteReturn> {
        return handleUpdateRequest<IngredientQuantity>(this.get,
                                               'IngredientQuantities',
                                               'IngredientQuantity',
                                               id,
                                               ingredientQuantity);
    }

    static async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest(this.get,
                                    'IngredientQuantities',
                                    'IngredientQuantity',
                                    id);
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : IngredientQuantityModel.genericErrorMessage;
    }
} 

export default IngredientQuantityModel; 


