import { ResultSetHeader } from 'mysql2';
import { connectDatabase, generateCreateSQLStatement } from '../../utils/databaseConnection';
import { StatusType, Status } from '../../utils/statusTypes';

export interface Token {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    token: string,
    expiryTime: number
};

class TokenModel {
    
    private static genericErrorMessage = 'Unknown Error';

    static async create(token: string, expiryTime: number): 
                Promise<Status<StatusType, number | undefined>> {
        
        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['token', token],
            ['expiryTime', expiryTime],
        ];
        try {
            const query = generateCreateSQLStatement('Tokens', columnData);
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: TokenModel.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
            Promise<Status<StatusType, Token | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = `SELECT * FROM Tokens WHERE ID = ${id}`;
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as Token
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
                message: TokenModel.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : TokenModel.genericErrorMessage;
    }
} 

export default TokenModel; 


