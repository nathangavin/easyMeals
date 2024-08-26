import { ResultSetHeader } from 'mysql2';
import { connectDatabase, 
        generateCreateSQLStatement, 
        generateGetSQLStatement } from '../utils/databaseConnection';
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
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('UserRecipe');

    static async create(userID: number, 
                        recipeID: number, 
                        rating: number): 
                Promise<Status<StatusType, number | undefined>> {

        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;

        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['userID', userID],
            ['recipeID', recipeID],
            ['rating', rating]
        ];
        try {
            const query = generateCreateSQLStatement('UserRecipes', columnData);
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: this.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
                Promise<Status<StatusType, UserRecipe | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = generateGetSQLStatement('UserRecipes', id);
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as UserRecipe
                    } : {
                        status: StatusType.Missing,
                        message: RECORD_MISSING_MSG('UserRecipe' ,id.toString())
                    };
            } else {
                return {
                    status: StatusType.Missing,
                    message: RECORD_MISSING_MSG('UserRecipe' ,id.toString())
                };
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: this.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : this.genericErrorMessage;
    }
}

export default UserRecipeModel;
