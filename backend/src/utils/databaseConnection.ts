import mysql, { Connection, ResultSetHeader } from 'mysql2/promise';
import { Status, StatusType } from './statusTypes';
import { INTERNAL_SERVER_ERROR_MSG, 
        RECORD_MISSING_MSG, 
        RECORD_UPDATED_MSG, 
        RECORD_DELETED_MSG,
        UNKNOWN_MODEL_ERROR_MSG } from './messages';
import { table } from 'console';

export type getCallback<T> = (id: number) => Promise<Status<StatusType, T | undefined>>;
export type createCallback = () => Promise<Status<StatusType, number | undefined>>;
export type updateDeleteCallback = (id: number) => Promise<Status<StatusType, string | undefined>>;

export async function connectDatabase(): Promise<Connection> {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root_password',
        database: 'easyMeals'
    });
}

export function generateCreateSQLStatement(tableName: string, columnNameValuePairs: (String | number | boolean)[][]): string {
    let statement = `INSERT INTO ${tableName} `;
    let columnNames = "(";
    let columnValues = "(";
    for (let i = 0; i < columnNameValuePairs.length; i++) {
        
        columnNames += columnNameValuePairs[i][0];
        if (typeof columnNameValuePairs[i][1] == 'number') {
            columnValues += columnNameValuePairs[i][1];
        } else if (typeof columnNameValuePairs[i][1] == 'boolean') {
            columnValues += columnNameValuePairs[i][1] ? 'TRUE' : 'FALSE';
        } else {
            columnValues += '"' + columnNameValuePairs[i][1] + '"';
        }

        if (i != columnNameValuePairs.length - 1) {
            columnNames += ',';
            columnValues += ',';
        }
    }

    columnNames += ")";
    columnValues += ")";

    statement += columnNames + " VALUES " + columnValues + ";";
    return statement;
}

export function generateUpdateSQLStatement(
                tablename: string, 
                id: number, 
                columnNameValuePairs: (String | number | boolean)[][]): string {
    let statement = `UPDATE ${tablename} SET `;
    let where = `WHERE ID=${id}`;

    for (let i = 0; i < columnNameValuePairs.length; i++) {
        if (typeof columnNameValuePairs[i][1] == 'number') {
            statement += `${columnNameValuePairs[i][0]} = ${columnNameValuePairs[i][1]}`;
        } else if (typeof columnNameValuePairs[i][1] == 'boolean') {
            statement += `${columnNameValuePairs[i][0]} = ${columnNameValuePairs[i][1]}`;
        } else {
            statement += `${columnNameValuePairs[i][0]} = '${columnNameValuePairs[i][1]}'`;
        }

        if (i < columnNameValuePairs.length - 1) {
            statement += ', ';
        }
    }

    statement += ` ${where};`;

    return statement;
}

export function generateGetSQLStatement(tablename: string, id: number) {
    return `SELECT * FROM ${tablename} WHERE ID = ${id};`;
}

export function generateColumnData<RecordType>(
                    record: RecordType, 
                    keys: Array<keyof RecordType>) : (String | number | boolean)[][] {
    let returnable : (String | number | boolean)[][] = [];
    for (const key of keys) {
        const keyString = key as string;
        const value = record[key] as (string | number | boolean);
            returnable.push([keyString, value]);
    }
    return returnable;
}

export function generateDeleteSQLStatement(tablename: string, id: number) {
    return `DELETE FROM ${tablename} WHERE ID = ${id};`;
}

export async function handleCreateRequest<T extends object>(record: T,
                                            tableName: string,
                                            tableMessageName: string) :
                                                Promise<Status<StatusType, number | undefined>> {
    
    const connection = await connectDatabase();
    try {
        const keys : Array<keyof T> = 
            Object.keys(record) as Array<keyof T>;
        const columnData = generateColumnData(record, keys);
        const query = generateCreateSQLStatement(tableName, columnData);
        const [result] = await connection.execute<ResultSetHeader>(query);
        return {
            status: StatusType.Success,
            value: result.insertId
        };
    } catch (err) {
        return {
            status: StatusType.Failure,
            message: errorMessage(tableMessageName, err)
        };
    } finally {
        await connection.end();
    }
}

export async function handleGetRequest<T>(id: number,
                                         tableName: string,
                                         tableMessageName: string) : 
                                             Promise<Status<StatusType, T | undefined>> {
    const connection = await connectDatabase();
    try {
        const query = generateGetSQLStatement(tableName, id);
        const [result] = await connection.execute(query);
        if (result instanceof Array) {
            return result.length > 0 ? {
                status: StatusType.Success,
                value: result[0] as T
            } : {
                status: StatusType.Missing,
                message: RECORD_MISSING_MSG(tableMessageName, id.toString())
            };
        } else {
            return {
                status: StatusType.Missing,
                message: RECORD_MISSING_MSG(tableMessageName, id.toString())
            };
        }
    } catch (err) {
        return {
            status: StatusType.Failure,
            message: errorMessage(tableMessageName, err)
        };
    } finally {
        await connection.end();
    }
}

export async function handleUpdateRequest<T>(getFunction: getCallback<T>,
                                            tableName: string,
                                            tableMessageName: string,
                                            id: number,
                                            record: T) :
                                                Promise<Status<StatusType, string | undefined>> {

    const connection = await connectDatabase();
    try {
        const objectStatus = await getFunction(id);

        if (objectStatus.status != StatusType.Success) return objectStatus;
        
        if (!objectStatus.value) {
            return {
                status: StatusType.Failure,
                message: `${INTERNAL_SERVER_ERROR_MSG} - ${RECORD_MISSING_MSG(tableMessageName, id.toString())}`
            };
        }

        const copiedObject = Object.assign(objectStatus.value, record, {
            modifiedTime: Date.now()
        });

        const keys : Array<keyof T> = 
            Object.keys(copiedObject) as Array<keyof T>;

        const columnData = generateColumnData(copiedObject, keys);
        const query = generateUpdateSQLStatement(tableName, id, columnData);
        const [_result] = await connection.execute<ResultSetHeader>(query);
        return {
            status: StatusType.Success,
            value: RECORD_UPDATED_MSG(tableMessageName, id.toString())
        };
    } catch (err) {
        return {
            status: StatusType.Failure,
            message: errorMessage(tableMessageName, err)
        };
    } finally {
        await connection.end();
    }
}

export async function handleDeleteRequest<T>(getFunction: getCallback<T>,
                                            tableName: string,
                                            tableMessageName: string,
                                            id: number) : 
                                                Promise<Status<StatusType, string | undefined>> {

        const connection = await connectDatabase();
        try {

            const objectStatus = await getFunction(id);

            if (objectStatus.status != StatusType.Success) return objectStatus;

            const query = generateDeleteSQLStatement(tableName, id);
            const [_result] = await connection.execute(query);
            return {
                status: StatusType.Success,
                value: RECORD_DELETED_MSG(tableMessageName, id.toString())
            }
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: errorMessage(tableName, error)
            };
        } finally {
            await connection.end();
        }
}

export function errorMessage(tableName: string, error?: any): string {
    return error instanceof Error ? error.message : UNKNOWN_MODEL_ERROR_MSG(tableName);
}
