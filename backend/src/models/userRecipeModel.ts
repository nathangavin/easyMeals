import { ResultSetHeader } from 'mysql2';
import { connectDatabase, generateCreateSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import UserModel from './userModel';
import RecipeModel from './recipeModel';

/*
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    userID INT NOT NULL,
    recipeID INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
        */
export interface UserRecipe {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    userID: number,
    recipeID: number,
    rating: number,
}

class UserRecipeModel {
    
    private static genericErrorMessage = 'Unknown Error';

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
            const query = generateCreateSQLStatement('UserRecipe', columnData);
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
            const query = `SELECT * FROM UserRecipes WHERE ID = ${id};`;
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as UserRecipe
                    } : {
                        status: StatusType.Empty,
                    };
            } else {
                return {
                    status: StatusType.Empty
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
