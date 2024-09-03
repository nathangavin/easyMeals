import { handleCreateRequest, 
        handleDeleteRequest, 
        handleGetRequest,
        handleUpdateRequest} from '../utils/databaseConnection';
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
                Promise<Status<StatusType, number | undefined>> {

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
            Promise<Status<StatusType, Unit | undefined>> {

        return handleGetRequest<Unit>(id, 'Units', 'Unit');
    }
        
    static async exists(id: number) : Promise<boolean> {
        const unitResult = await this.get(id);
        return (unitResult.status == StatusType.Success);
    }

    static async update(id: number, unit: Unit) :
            Promise<Status<StatusType, string | undefined>> {
        return handleUpdateRequest<Unit>(this.get,
                                        'Units',
                                        'Unit',
                                        id,
                                        unit);
    }

    static async delete(id: number) :
            Promise<Status<StatusType, string | undefined>> {
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


