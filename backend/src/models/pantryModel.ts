import { ResultSetHeader } from 'mysql2';
import { connectDatabase } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';

class PantryModel {
    
    private static genericErrorMessage = 'Unknown Error';

    static async create(name: string): 
                Promise<Status<StatusType, number | undefined>> {

        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        try {
            const query = `INSERT INTO Pantries (name,createdTime,modifiedTime) 
                        VALUES ("${name}",${createdTime}, ${modifiedTime});`;
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
            Promise<Status<StatusType, object | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = `SELECT * FROM Pantries WHERE ID = ${id}`;
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


