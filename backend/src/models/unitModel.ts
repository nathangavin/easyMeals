import { ResultSetHeader } from 'mysql2';
import { connectDatabase, 
        generateCreateSQLStatement, 
        generateGetSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import { RECORD_MISSING_MSG, 
        UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export interface Unit {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    description: string
};

class UnitModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('Unit');

    static async create(description: string): 
                Promise<Status<StatusType, number | undefined>> {

        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['description', description]
        ];
        try {
            const query = generateCreateSQLStatement('Units', columnData);
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: UnitModel.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
            Promise<Status<StatusType, Unit | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = generateGetSQLStatement('Units', id);
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as Unit
                    } : {
                        status: StatusType.Missing,
                        message: RECORD_MISSING_MSG('Unit', id.toString())
                    };
            } else {
                return {
                    status: StatusType.Missing,
                    message: RECORD_MISSING_MSG('Unit', id.toString())
                };
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: UnitModel.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : UnitModel.genericErrorMessage;
    }
} 

export default UnitModel; 


