import { ResultSetHeader } from 'mysql2';
import { connectDatabase, generateCreateSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';

export interface Recipe {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    name: string,
    draftFlag: boolean
}

class RecipeModel {
    
    private static genericErrorMessage = 'Unknown Error';

    static async create(name: string): 
                Promise<Status<StatusType, number | undefined>> {

        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['name', name],
            ['draftFlag', true]
        ];
        try {
            const query = generateCreateSQLStatement('Recipes', columnData);
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: RecipeModel.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
            Promise<Status<StatusType, Recipe | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = `SELECT * FROM Recipes WHERE ID = ${id}`;
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as Recipe
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
                message: RecipeModel.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : RecipeModel.genericErrorMessage;
    }
} 

export default RecipeModel; 


