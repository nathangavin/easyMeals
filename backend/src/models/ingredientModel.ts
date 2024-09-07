import { createReturn, 
        getReturn, 
        handleCreateRequest, 
        handleGetRequest, 
        handleGetAllRequest,
        handleUpdateRequest, 
        handleDeleteRequest,
        updateDeleteReturn, 
        getAllReturn} from '../utils/databaseConnection';
import UnitModel from './unitModel';
import { UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';
import { StatusType } from '../utils/statusTypes';

export interface Ingredient {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    name: string,
    unitID: number
};

class IngredientModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('Ingredient');

    static async create(name: string, unitID: number): Promise<createReturn> {
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const ingredient = {
            createdTime,
            modifiedTime,
            name,
            unitID
        } as Ingredient;
        return handleCreateRequest<Ingredient>(ingredient, 'Ingredients', 'Ingredient');
    }

    static async get(id: number): Promise<getReturn<Ingredient>> {
        return handleGetRequest<Ingredient>(id, 'Ingredients', 'Ingredient');
    }

    static async getAll() : Promise<getAllReturn<Ingredient>> {
        return handleGetAllRequest<Ingredient>('Ingredients', 'Ingredient');
    }

    static async exists(id: number) : Promise<boolean> {
        const result = await this.get(id);
        return (result.status == StatusType.Success);
    }

    static async update(id: number, ingredient: Ingredient) : Promise<updateDeleteReturn> {
        return handleUpdateRequest<Ingredient>(this.get,
                                               'Ingredients',
                                               'Ingredient',
                                               id,
                                               ingredient);
    }

    static async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest(this.get,
                                    'Ingredients',
                                    'Ingredient',
                                    id);
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : IngredientModel.genericErrorMessage;
    }
} 

export default IngredientModel; 


