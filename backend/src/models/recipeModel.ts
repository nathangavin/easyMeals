import { handleCreateRequest,
        handleGetRequest,
        handleUpdateRequest} from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import { UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export interface Recipe {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    name: string,
    draftFlag: boolean
}

class RecipeModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('Recipe');

    static async create(name: string): 
                Promise<Status<StatusType, number | undefined>> {

        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const recipe = {
            createdTime,
            modifiedTime,
            name,
            draftFlag: true
        } as Recipe;
        return handleCreateRequest(recipe, 'Recipes', 'Recipe');
    }

    static async get(id: number): 
            Promise<Status<StatusType, Recipe | undefined>> {

        return handleGetRequest(id, 'Recipes', 'Recipe');
    }
    
    static async exists(id: number) : Promise<boolean> {
        const recipeResult = await this.get(id);
        return (recipeResult.status == StatusType.Success);
    }

    static async update(id: number, recipe: Recipe) : 
            Promise<Status<StatusType, string | undefined>> {
        
        return handleUpdateRequest<Recipe>(this.get,
                                            'Recipes',
                                            'Recipe',
                                            id,
                                            recipe);
         
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : RecipeModel.genericErrorMessage;
    }
} 

export default RecipeModel; 


