import mysql, { Connection } from 'mysql2/promise';

export async function connectDatabase(): Promise<Connection> {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root_password',
        database: 'easyMeals'
    });
}


export function generateCreateSQLStatement(tableName: string, columnNameValuePairs: (String | number)[][]): string {
    let statement = `INSERT INTO ${tableName} `;
    let columnNames = "(";
    let columnValues = "(";
    for (let i = 0; i < columnNameValuePairs.length; i++) {
        
        columnNames += columnNameValuePairs[i][0];
        if (typeof columnNameValuePairs[i][1] == 'number') {
            columnValues += columnNameValuePairs[i][1];
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

export function generateUpdateSQLStatement(tablename: string, id: number, columnNameValuePairs: (String | number)[][]): string {
    let statement = `UPDATE ${tablename} SET `;
    let where = `WHERE ID=${id}`;

    for (let i = 0; i < columnNameValuePairs.length; i++) {
        if (typeof columnNameValuePairs[i][1] == 'number') {
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
