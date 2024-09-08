import { createReturn, 
        getReturn, 
        getAllReturn,
        handleCreateRequest,
        handleDeleteRequest,
        handleGetAllRequest,
        handleGetRequest,
        updateDeleteReturn} from '../utils/databaseConnection';
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
                Promise<createReturn> {

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
                Promise<getReturn<UserPantry>> {
        return handleGetRequest<UserPantry>(id, 'UserPantries', 'UserPantry');
    }

    static async getAll() : Promise<getAllReturn<UserPantry>> {
        return handleGetAllRequest<UserPantry>('UserPantries', 
                                               'UserPantry');
    }

    static async update(id: number) : Promise<updateDeleteReturn> {
        return {
            status: StatusType.Failure,
            message: INTERNAL_SERVER_ERROR_MSG
        };
    }

    static async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest<UserPantry>(this.get, 'UserPantries', 'UserPantry', id);
    }

}

export default UserPantryModel;
