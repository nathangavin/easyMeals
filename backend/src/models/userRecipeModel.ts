import { ResultSetHeader } from 'mysql2';
import { connectDatabase, 
        generateCreateSQLStatement, 
        generateGetSQLStatement, 
        handleCreateRequest,
        handleDeleteRequest,
        handleGetRequest,
        handleUpdateRequest} from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import { RECORD_MISSING_MSG, 
        UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export interface UserRecipe {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    userID: number,
    recipeID: number,
    rating: number,
}

class UserRecipeModel {
    
    static async create(userID: number, 
                        recipeID: number, 
                        rating: number): 
                Promise<Status<StatusType, number | undefined>> {

        const createdTime = Date.now();
        const modifiedTime = createdTime;
        
        const userRecipe = {
            userID,
            recipeID,
            rating,
            createdTime,
            modifiedTime
        } as UserRecipe;

        return handleCreateRequest<UserRecipe>(userRecipe, 'UserRecipes', 'UserRecipe');
    }

    static async get(id: number): 
                Promise<Status<StatusType, UserRecipe | undefined>> {
        return handleGetRequest<UserRecipe>(id, 'UserRecipes', 'UserRecipe');
    }

    static async update(id: number, rating: number) :
                Promise<Status<StatusType, string | undefined>> {
        
        const newUserRecipe = {
            rating
        } as UserRecipe;
        return handleUpdateRequest<UserRecipe>(this.get, 'UserRecipes', 'UserRecipe', id, newUserRecipe);
    }

    static async delete(id: number) : 
                Promise<Status<StatusType, string | undefined>> {
        return handleDeleteRequest<UserRecipe>(this.get, 'UserRecipes', 'UserRecipe', id);
    }

}

export default UserRecipeModel;
