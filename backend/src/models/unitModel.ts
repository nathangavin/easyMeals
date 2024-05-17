import { ResultSetHeader } from 'mysql2';
import { connectDatabase, generateCreateSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';

export interface Unit {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    description: string
};

class UnitModel {
    
    private static genericErrorMessage = 'Unknown Error';

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
            Promise<Status<StatusType, object | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = `SELECT ID, createdTime, modifiedTime, description FROM Units WHERE ID = ${id}`;
            const [result] = await connection.execute(query);

            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0]
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


