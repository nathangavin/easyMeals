import { handleCreateRequest,
        handleDeleteRequest,
        handleGetRequest,
        handleUpdateRequest} from '../utils/databaseConnection';
import { INTERNAL_SERVER_ERROR_MSG } from '../utils/messages';
import { StatusType, Status } from '../utils/statusTypes';

export interface UserPantry {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    userID: number,
    pantryID: number,
}

class UserPantryModel {
    
    static async create(userID: number, 
                        pantryID: number): 
                Promise<Status<StatusType, number | undefined>> {

        const createdTime = Date.now();
        const modifiedTime = createdTime;
        
        const userPantry = {
            userID,
            pantryID,
            createdTime,
            modifiedTime
        } as UserPantry;

        return handleCreateRequest<UserPantry>(userPantry, 'UserPantries', 'UserPantry');
    }

    static async get(id: number): 
                Promise<Status<StatusType, UserPantry | undefined>> {
        return handleGetRequest<UserPantry>(id, 'UserPantries', 'UserPantry');
    }

    static async update(id: number) :
                Promise<Status<StatusType, string | undefined>> {
        
        return {
            status: StatusType.Failure,
            message: INTERNAL_SERVER_ERROR_MSG
        };
    }

    static async delete(id: number) : 
                Promise<Status<StatusType, string | undefined>> {
        return handleDeleteRequest<UserPantry>(this.get, 'UserPantries', 'UserPantry', id);
    }

}

export default UserPantryModel;
