import { createReturn, getAllReturn, getReturn, handleCreateRequest, 
        handleDeleteRequest, 
        handleGetAllRequest, 
        handleGetRequest,
        handleUpdateRequest,
        updateDeleteReturn} from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import { UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';
import { CanCreate, 
    CanDelete, 
    CanGet,
    CanExists, 
    CanGetAll, 
    CanUpdate, 
    DbCommon } from './common/tableInterface';

/*
export interface Unit {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    description: string
};
*/

export class Unit implements DbCommon {
    ID: number | undefined;
    createdTime: number;
    modifiedTime: number;
    description: string;

    constructor(description: string) {
        this.description = description;
        this.createdTime = Date.now();
        this.modifiedTime = this.createdTime;
    }
}

class UnitDbInterface implements CanCreate<Unit>, 
                            CanGet<Unit>, 
                            CanGetAll<Unit>, 
                            CanExists, 
                            CanUpdate<Unit>, 
                            CanDelete {

    async create(input: Unit): Promise<createReturn> {
        return handleCreateRequest<Unit>(input, 'Units', 'Unit');
    }

    async get(id: number): Promise<getReturn<Unit>> {
        return handleGetRequest<Unit>(id, 'Units', 'Unit');
    }

    async getAll() : Promise<getAllReturn<Unit>> {
        return handleGetAllRequest<Unit>('Units', 'Unit');
    }
        
    async exists(id: number) : Promise<boolean> {
        const unitResult = await this.get(id);
        return (unitResult.status == StatusType.Success);
    }

    async update(id: number, unit: Unit) : Promise<updateDeleteReturn> {
        return handleUpdateRequest<Unit>(this.get,
                                        'Units',
                                        'Unit',
                                        id,
                                        unit);
    }

    async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest<Unit>(this.get,
                                        'Units',
                                        'Unit',
                                        id);
    }
} 

export default UnitDbInterface; 


