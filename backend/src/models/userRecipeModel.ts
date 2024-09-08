import { createReturn, 
        getReturn,
        getAllReturn,
        handleCreateRequest,
        handleDeleteRequest,
        handleGetAllRequest,
        handleGetRequest,
        handleUpdateRequest,
        updateDeleteReturn} from '../utils/databaseConnection';

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
                        rating: number): Promise<createReturn> {

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
                Promise<getReturn<UserRecipe>> {
        return handleGetRequest<UserRecipe>(id, 'UserRecipes', 'UserRecipe');
    }

    static async getAll() : Promise<getAllReturn<UserRecipe>> {
        return handleGetAllRequest<UserRecipe>('UserRecipes', 
                                               'UserRecipe');
    }

    static async update(id: number, rating: number): Promise<updateDeleteReturn> {
        
        const newUserRecipe = {
            rating
        } as UserRecipe;
        return handleUpdateRequest<UserRecipe>(this.get, 
                                               'UserRecipes', 
                                               'UserRecipe', 
                                               id, 
                                               newUserRecipe);
    }

    static async delete(id: number) : Promise<updateDeleteReturn> {
        return handleDeleteRequest<UserRecipe>(this.get, 
                                               'UserRecipes', 
                                               'UserRecipe', 
                                               id);
    }

}

export default UserRecipeModel;
