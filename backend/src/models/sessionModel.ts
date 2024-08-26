import { ResultSetHeader } from 'mysql2';
import { connectDatabase, 
        generateCreateSQLStatement, 
        generateGetSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import { RECORD_DELETED_MSG, 
        RECORD_MISSING_MSG,
        UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export const TOKEN_LENGTH = 100;

export interface Session {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    token: string,
    expiryTime: number,
    UserID: number
};

class SessionModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('Session');

    static async create(userID: number, expiryTime: number): 
                Promise<Status<StatusType, number | undefined>> {
        
        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['token', SessionModel.generateSessionToken()],
            ['expiryTime', expiryTime],
            ['UserID', userID]
        ];
        try {
            const query = generateCreateSQLStatement('Sessions', columnData);
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: SessionModel.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
            Promise<Status<StatusType, Session | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = generateGetSQLStatement('Sessions', id);
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as Session 
                    } : {
                        status: StatusType.Missing,
                        message: RECORD_MISSING_MSG('Session', id.toString())
                    };
            } else {
                return {
                    status: StatusType.Missing,
                    message: RECORD_MISSING_MSG('Session', id.toString())
                };
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: SessionModel.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    static async getByToken(sessionToken: string): 
        Promise<Status<StatusType, Session | undefined>> {
            
        const connection = await connectDatabase();
        try {
            const query = `SELECT * FROM Sessions WHERE token = '${sessionToken}'`;
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as Session 
                    } : {
                        status: StatusType.Missing,
                        message: RECORD_MISSING_MSG('Session by token', sessionToken)
                    };
            } else {
                return {
                    status: StatusType.Missing,
                    message: RECORD_MISSING_MSG('Session by token', sessionToken)
                };
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: SessionModel.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    static async delete(sessionToken: string):
            Promise<Status<StatusType, string | undefined>> {
    
        const connection = await connectDatabase();
        try {

            const sessionStatus = await this.getByToken(sessionToken);

            if (sessionStatus.status != StatusType.Success) return sessionStatus;

            const query = `DELETE FROM Sessions WHERE token = '${sessionToken}';`;
            const [_result] = await connection.execute(query);
            return {
                status: StatusType.Success,
                value: RECORD_DELETED_MSG('Session by token', sessionToken)
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: SessionModel.errorMessage(error)
            };
        } finally {
            await connection.end();
        }

    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : SessionModel.genericErrorMessage;
    }

    private static generateSessionToken(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        let token = '';
        let tokenLength = TOKEN_LENGTH;
        for (let i = 0; i < tokenLength; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }

        return token;
    }
} 

export default SessionModel; 


