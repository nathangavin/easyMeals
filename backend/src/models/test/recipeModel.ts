import { handleCreateRequest,
        handleDeleteRequest,
        getAllReturn,
        handleGetAllRequest,
        handleGetRequest,
        handleUpdateRequest,
        createReturn,
        getReturn,
        updateDeleteReturn} from '../../utils/databaseConnection';
import { StatusType } from '../../utils/statusTypes';
import { CanCreate, CanDelete, CanExists, CanGet, CanGetAll, CanUpdate, DbCommon, DbNames } from '../common/tableInterface';

export class Recipe implements DbCommon {
    ID: number | undefined;
    createdTime: number;
    modifiedTime: number;
    name: string;
    draftFlag: boolean;

    constructor(name: string) {
        this.name = name;
        this.createdTime = Date.now();
        this.modifiedTime = this.createdTime;
        this.draftFlag = true;
    }
}

export const RecipeDbNames = {
    tableName: 'Recipes',
    messageName: 'Recipe',
    fieldName: 'recipe',
    multipleFieldName: 'recipes'
} as DbNames;

class RecipeDbInterface implements CanCreate<Recipe>,
                                CanGet<Recipe>,
                                CanGetAll<Recipe>,
                                CanExists,
                                CanUpdate<Recipe>,
                                CanDelete {

    async create(input: Recipe): Promise<createReturn> {
        return handleCreateRequest<Recipe>(input,
                                          RecipeDbNames.tableName,
                                          RecipeDbNames.messageName);
    }

    async get(id: number): Promise<getReturn<Recipe>> {
        return handleGetRequest(id, 
                                RecipeDbNames.tableName,
                                RecipeDbNames.messageName);
    }

    async getAll(): Promise<getAllReturn<Recipe>> {
        return handleGetAllRequest<Recipe>(RecipeDbNames.tableName,
                                          RecipeDbNames.messageName);
    }
    
    async exists(id: number): Promise<boolean> {
        const recipeResult = await this.get(id);
        return (recipeResult.status == StatusType.Success);
    }

    async update(id: number, record: Recipe): Promise<updateDeleteReturn> {
        return handleUpdateRequest<Recipe>(this.get,
                                            RecipeDbNames.tableName,
                                            RecipeDbNames.messageName,
                                            id,
                                            record);
    }

    async delete(id: number): Promise<updateDeleteReturn> {
        return handleDeleteRequest<Recipe>(this.get,
                                              RecipeDbNames.tableName,
                                              RecipeDbNames.messageName,
                                              id); 
    }
} 

export default RecipeDbInterface; 


