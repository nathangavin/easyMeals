import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';
import { connectDatabase, generateCreateSQLStatement, generateUpdateSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import TokenModel, { Token } from './tokens/TokenModel';
import { generateToken } from '../utils/tokens';
import { todo } from 'node:test';

export interface User {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    firstname: string,
    lastname: string,
    email: string,
    passwordHash: string,
    loginTokenID: number
};

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
            const query = `SELECT * FROM Users WHERE ID = ${id};`;
            const [result] = await connection.execute(query);
            if (result instanceof Array) {
                return result.length > 0 ? {
                        status: StatusType.Success,
                        value: result[0] as User
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
                    status: StatusType.Empty
                };
            } else {
                return {
                    status: StatusType.Empty
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
    
    /**
     * Status types
     * Empty - User doesn't exist
     * Missing - Password incorrect
     * Success - login successful, token returned 
     * Failure - error
     */
    static async login(email: string, password: string) : Promise<Status<StatusType, string | undefined>> {
        const connection = await connectDatabase();

        try {
            
            // check if user exists
            const userStatus = await this.getByEmail(email);
            if (userStatus.status != StatusType.Success) {
                return {
                    status: StatusType.Empty
                };
            }
            
            // check if password matches 
            if (userStatus.value) {
                const passwordCompareResult = await bcrypt.compare(password, userStatus.value.passwordHash);
                
                // if yes, generate token and return token
                if (passwordCompareResult) {
                    const token = generateToken();
                    const expiryTime = Date.now() + 900;
                    const tokenStatus = await TokenModel.create(token, expiryTime);
                    
                    switch (tokenStatus.status) {
                        case StatusType.Success: 
                            // update user to store tokenID
                            todo();
                            return {
                                status: StatusType.Success,
                                value: token
                            };
                        case StatusType.Failure:
                            return {
                                status: StatusType.Failure,
                                message: tokenStatus.message
                            };
                        default:
                            return {
                                status: StatusType.Failure,
                                message: 'Unknown User Error'
                            }
                    }
                    
                } else {
                    return {
                        status: StatusType.Missing,
                        message: 'Password Incorrect'
                    };
                }
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: this.errorMessage(error)
            };
        } finally {
            await connection.end();
        }

        return {
            status: StatusType.Empty
        };
    }

    static async update(id: number, user: User) : Promise<Status<StatusType, string | undefined >> {
        const connection = await connectDatabase();

        try {
            
            // get user

            const userStatus = await this.get(id);

            if (userStatus.status == StatusType.Success && userStatus.value) {
                // do a diff between retrieved user and provided user
                // user is provided user
                // userStatus.value is retrieved user
                // result should be retrieved user with values overridden by provided user

                // remove protected fields from provided user
                // object.assign(a,b) result takes a and overrides values with b
                let copiedUser = Object.assign(userStatus.value, {
                    modifiedTime: Date.now(),
                    firstname: user.firstname,
                    lastname: user.lastname,
                });

                // make update call to db

                const columnData = [
                    ['modifiedTime', copiedUser.modifiedTime],
                    ['firstname', copiedUser.firstname],
                    ['lastname', copiedUser.lastname]
                ];

                const query = generateUpdateSQLStatement('Users', id, columnData);
                const [result] = await connection.execute<ResultSetHeader>(query);
                return {
                    status: StatusType.Success,
                    value: 'updated'
                };
            } else {
                return {
                    status: StatusType.Missing,
                    message: 'User does not exist'
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

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : this.genericErrorMessage;
    }
} 

export default UserModel; 


