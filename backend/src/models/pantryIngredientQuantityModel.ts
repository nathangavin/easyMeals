import { createReturn, 
        getReturn, 
        handleCreateRequest, 
        handleGetRequest, 
        handleUpdateRequest, 
        handleDeleteRequest,
        updateDeleteReturn } from '../utils/databaseConnection';
import { UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';
import { StatusType } from '../utils/statusTypes';

export interface PantryIngredientQuantity {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    quantityID: number,
    pantryID: number
};

class PantryIngredientQuantityModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('PantryIngredientQuantity');

    static async create(quantityID: number, pantryID: number): Promise<createReturn> {
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const pantryIngredientQuantity = {
            createdTime,
            modifiedTime,
            quantityID,
            pantryID
        } as PantryIngredientQuantity;

        return handleCreateRequest<PantryIngredientQuantity>(pantryIngredientQuantity, 
                                                       'PantryIngredientQuantities', 
                                                       'PantryIngredientQuantity');
    }

    static async get(id: number): Promise<getReturn<PantryIngredientQuantity>> {
        return handleGetRequest<PantryIngredientQuantity>(id, 
                                                    'PantryIngredientQuantities', 
                                                    'PantryIngredientQuantity');
    }

    static async exists(id: number) : Promise<boolean> {
        const result = await this.get(id);
        return (result.status == StatusType.Success);
    }

    static async update(id: number, pantryIngredientQuantity: PantryIngredientQuantity) : Promise<updateDeleteReturn> {
        return handleUpdateRequest<PantryIngredientQuantity>(this.get,
                                               'PantryIngredientQuantities',
                                               'PantryIngredientQuantity',
                                               id,
                                               pantryIngredientQuantity);
    }

    static async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest(this.get,
                                    'PantryIngredientQuantities',
                                    'PantryIngredientQuantity',
                                    id);
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : PantryIngredientQuantityModel.genericErrorMessage;
    }
} 

export default PantryIngredientQuantityModel; 


