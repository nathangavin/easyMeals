import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';
import { connectDatabase, 
        generateColumnData, 
        generateCreateSQLStatement, 
        generateGetSQLStatement, 
        generateUpdateSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import SessionModel from './sessionModel';
import { INTERNAL_SERVER_ERROR_MSG, 
        PASSWORD_INCORRECT_MSG, 
        RECORD_MISSING_MSG, 
        RECORD_UPDATED_MSG,
        UNKNOWN_MODEL_ERROR_MSG } from '../utils/messages';

export interface User {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    firstname: string,
    lastname: string,
    email: string,
    passwordHash: string
};

class UserModel {
    
    private static genericErrorMessage = UNKNOWN_MODEL_ERROR_MSG('User');

    static async create(newUser: User, password: string): 
                Promise<Status<StatusType, number | undefined>> {

        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        
        const salt = await bcrypt.genSalt(10);
        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['firstname', newUser.firstname],
            ['lastname', newUser.lastname],
            ['email', newUser.email],
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
                message: this.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
            Promise<Status<StatusType, User | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = generateGetSQLStatement('Users', id);
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as User
                    } : {
                        status: StatusType.Missing,
                        message: RECORD_MISSING_MSG('User', id.toString())
                    };
            } else {
                return {
                    status: StatusType.Missing,
                    message: RECORD_MISSING_MSG('User', id.toString())
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

    static async getByEmail(email: string) : Promise<Status<StatusType, User | undefined>> {
        const connection = await connectDatabase();
        try {
            const query = `SELECT * FROM Users WHERE email = '${email}';`;
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                    status: StatusType.Success,
                    value: result[0] as User
                } : {
                    status: StatusType.Missing,
                    message: RECORD_MISSING_MSG('User by email', email)
                };
            } else {
                return {
                    status: StatusType.Missing,
                    message: RECORD_MISSING_MSG('User by email', email)
                };
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: this.errorMessage(error)
            };
        } finally {
            await connection.end();
        }
    }

    static async existsByEmail(email: string) : Promise<boolean> {
        const userResult = await this.getByEmail(email);
        return (userResult.status == StatusType.Success);
    }
    
    static async login(email: string, password: string) : Promise<Status<StatusType, number | undefined>> {
        const connection = await connectDatabase();
        try {
            
            // check if user exists
            const userStatus = await this.getByEmail(email);
            
            if (userStatus.status != StatusType.Success) return userStatus;
            if (!userStatus.value) {
                return {
                    status: StatusType.Failure,
                    message: `${INTERNAL_SERVER_ERROR_MSG} - ${RECORD_MISSING_MSG('User by Email', email)}`
                };
            }
            
            // check if password matches 
            let passwordCompareResult = 
                    await bcrypt.compare(password, userStatus.value.passwordHash);

            if (!passwordCompareResult) {
                return {
                    status: StatusType.Failure,
                    message: PASSWORD_INCORRECT_MSG
                };
            }
            // if yes, generate token and return token
            const expiryTime = Date.now() + 900; // 15 minutes
            const sessionStatus = 
                await SessionModel.create(userStatus.value.ID, expiryTime);

            switch (sessionStatus.status) {
                case StatusType.Failure:
                    return {
                        status: StatusType.Failure,
                        message: sessionStatus.message
                    };
                case StatusType.Success:
                    return {
                        status: StatusType.Success,
                        value: sessionStatus.value
                    };
                default:
                    return {
                        status: StatusType.Failure,
                        message: this.errorMessage()
                    };
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: this.errorMessage(error)
            };
        } finally {
            await connection.end();
        }
    }

    static async update(id: number, user: User) : Promise<Status<StatusType, string | undefined >> {
        const connection = await connectDatabase();

        try {
            
            // get user
            const userStatus = await this.get(id);

            if (userStatus.status != StatusType.Success) return userStatus;
            if (!userStatus.value) {
                // if status is Success but value is missing, then internal error
                return {
                    status: StatusType.Failure,
                    message: `${INTERNAL_SERVER_ERROR_MSG} - ${RECORD_MISSING_MSG('User', id.toString())}`
                };
            }

            /*
            * do a diff between retrieved user and provided user
            * user is provided user
            * userStatus.value is retrieved user
            * result should be retrieved user with values overridden by provided user
            */
            const copiedUser = Object.assign(userStatus.value, user, {
                modifiedTime: Date.now()
            });

            /* 
            * remove protected fields from provided user
            * object.assign(a,b) result takes a and overrides values with b
            * make update call to db
            */
            const keys : Array<keyof User> = 
                Object.keys(copiedUser) as Array<keyof User>;
            const columnData = generateColumnData(copiedUser, keys);


            const query = generateUpdateSQLStatement('Users', id, columnData);
            const [_result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                
                value: RECORD_UPDATED_MSG('User', id.toString())
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

    private static errorMessage(error?: any): string {
        return error instanceof Error ? error.message : this.genericErrorMessage;
    }
} 

export default UserModel; 


