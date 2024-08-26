import { ResultSetHeader } from 'mysql2';
import { connectDatabase, generateCreateSQLStatement, generateGetSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import { RECORD_MISSING_MSG, UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export interface Pantry {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    name: string,
};

class PantryModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('Pantry');

    static async create(name: string): 
                Promise<Status<StatusType, number | undefined>> {

        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['name', name]
        ];
        try {
            const query = generateCreateSQLStatement('Pantries', columnData);
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: PantryModel.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
            Promise<Status<StatusType, Pantry | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = generateGetSQLStatement('Pantries', id);
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as Pantry
                    } : {
                        status: StatusType.Missing,
                        message: RECORD_MISSING_MSG('Pantry', id.toString())
                    };
            } else {
                return {
                    status: StatusType.Missing,
                    message: RECORD_MISSING_MSG('Pantry', id.toString())
                };
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: PantryModel.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : PantryModel.genericErrorMessage;
    }
} 

export default PantryModel; 


