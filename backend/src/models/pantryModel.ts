import { ResultSetHeader } from 'mysql2';
import { connectDatabase, createReturn, generateCreateSQLStatement, generateGetSQLStatement, getReturn, handleCreateRequest, handleDeleteRequest, handleGetRequest, handleUpdateRequest, updateDeleteReturn } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import { RECORD_MISSING_MSG, UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export interface Pantry {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    name: string,
};

class PantryModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('Pantry');

    static async create(name: string): 
                Promise<createReturn> {

        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const pantry = {
            createdTime,
            modifiedTime,
            name
        } as Pantry;
        return handleCreateRequest<Pantry>(pantry,'Pantries', 'Pantry');
    }

    static async get(id: number): 
            Promise<getReturn<Pantry>> {

        return handleGetRequest<Pantry>(id, 'Pantries', 'Pantry');
    }

    static async update(id: number, pantry: Pantry) : 
            Promise<updateDeleteReturn> {
        return handleUpdateRequest<Pantry>(this.get,
                                          'Pantries',
                                          'Pantry',
                                          id,
                                          pantry);
    }

    static async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest(this.get,
                                    'Pantries',
                                    'Pantry',
                                    id);
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : PantryModel.genericErrorMessage;
    }
} 

export default PantryModel; 


