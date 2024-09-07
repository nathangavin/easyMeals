import { createReturn, getAllReturn, getReturn, handleCreateRequest, 
        handleDeleteRequest, 
        handleGetAllRequest, 
        handleGetRequest,
        handleUpdateRequest,
        updateDeleteReturn} from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import { UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export interface Unit {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    description: string
};

class UnitModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('Unit');

    static async create(description: string): 
                Promise<createReturn> {

        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const userRecipe = {
            description,
            createdTime,
            modifiedTime
        } as Unit;

        return handleCreateRequest<Unit>(userRecipe, 'Units', 'Unit');
    }

    static async get(id: number): 
            Promise<getReturn<Unit>> {

        return handleGetRequest<Unit>(id, 'Units', 'Unit');
    }

    static async getAll() : Promise<getAllReturn<Unit>> {
        return handleGetAllRequest<Unit>('Units', 'Unit');
    }
        
    static async exists(id: number) : Promise<boolean> {
        const unitResult = await this.get(id);
        return (unitResult.status == StatusType.Success);
    }

    static async update(id: number, unit: Unit) :
            Promise<updateDeleteReturn> {
        return handleUpdateRequest<Unit>(this.get,
                                        'Units',
                                        'Unit',
                                        id,
                                        unit);
    }

    static async delete(id: number) :
            Promise<updateDeleteReturn> {
        return handleDeleteRequest<Unit>(this.get,
                                        'Units',
                                        'Unit',
                                        id);
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : UnitModel.genericErrorMessage;
    }
} 

export default UnitModel; 


