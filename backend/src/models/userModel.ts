import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';
import { connectDatabase, generateCreateSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';

class UserModel {
    
    private static genericErrorMessage = 'Unknown User Model Error';

    static async create(firstname: string, lastname: string, email: string, password: string): 
                Promise<Status<StatusType, number | undefined>> {

        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        
        const salt = await bcrypt.genSalt(10);
        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['firstname', firstname],
            ['lastname', lastname],
            ['email', email],
            ['passwordHash', await bcrypt.hash(password, salt)]
        ];
        try {
            const query = generateCreateSQLStatement('Users', columnData);
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: UserModel.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
            Promise<Status<StatusType, object | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = `SELECT * FROM Units WHERE ID = ${id}`;
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
                message: UserModel.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : UserModel.genericErrorMessage;
    }
} 

export default UserModel; 


