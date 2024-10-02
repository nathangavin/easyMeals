import { createReturn, 
        getAllReturn, 
        getReturn, 
        handleCreateRequest, 
        handleDeleteRequest, 
        handleGetAllRequest, 
        handleGetRequest,
        handleUpdateRequest,
        updateDeleteReturn} from '../../utils/databaseConnection';
import { StatusType } from '../../utils/statusTypes';
import { CanCreate, 
    CanDelete, 
    CanGet,
    CanExists, 
    CanGetAll, 
    CanUpdate, 
    DbCommon, 
    DbNames} from '../common/tableInterface';

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
export const UnitDbNames = {
    tableName: 'Units',
    messageName: 'Unit',
    fieldName: 'unit',
    multipleFieldName: 'units'
} as DbNames;

class UnitDbInterface implements CanCreate<Unit>, 
                                    CanGet<Unit>, 
                                    CanGetAll<Unit>, 
                                    CanExists, 
                                    CanUpdate<Unit>, 
                                    CanDelete {

    async create(input: Unit): Promise<createReturn> {
        return handleCreateRequest<Unit>(input, 
                                         UnitDbNames.tableName, 
                                         UnitDbNames.messageName);
    }

    async get(id: number): Promise<getReturn<Unit>> {
        return handleGetRequest<Unit>(id, 
                                      UnitDbNames.tableName, 
                                      UnitDbNames.messageName);
    }

    async getAll() : Promise<getAllReturn<Unit>> {
        return handleGetAllRequest<Unit>(UnitDbNames.tableName, 
                                         UnitDbNames.messageName);
    }
        
    async exists(id: number) : Promise<boolean> {
        const unitResult = await this.get(id);
        return (unitResult.status == StatusType.Success);
    }

    async update(id: number, unit: Unit) : Promise<updateDeleteReturn> {
        return handleUpdateRequest<Unit>(this.get,
                                        UnitDbNames.tableName,
                                        UnitDbNames.messageName,
                                        id,
                                        unit);
    }

    async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest<Unit>(this.get,
                                        UnitDbNames.tableName,
                                        UnitDbNames.messageName,
                                        id);
    }
} 

export default UnitDbInterface; 


