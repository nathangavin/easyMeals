import { ResultSetHeader } from 'mysql2';
import { connectDatabase, generateCreateSQLStatement, generateGetSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import UnitModel from './unitModel';
import { RECORD_MISSING_MSG, UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export interface Ingredient {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    name: string,
    unitID: number
};

class IngredientModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('Ingredient');

    static async create(name: string, unitID: number): 
                Promise<Status<StatusType, number | undefined>> {
        
        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['name', name],
            ['unitID', unitID]
        ];
        try {
            const query = generateCreateSQLStatement('Ingredients', columnData);
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: IngredientModel.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
            Promise<Status<StatusType, Ingredient | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = generateGetSQLStatement('Ingredients', id);
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as Ingredient
                    } : {
                        status: StatusType.Missing,
                        message: RECORD_MISSING_MSG('Ingredient', id.toString())
                    };
            } else {
                return {
                    status: StatusType.Missing,
                    message: RECORD_MISSING_MSG('Ingredient', id.toString())
                };
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: IngredientModel.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : IngredientModel.genericErrorMessage;
    }
} 

export default UnitModel; 


