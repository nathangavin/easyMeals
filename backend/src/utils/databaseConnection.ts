import mysql, { Connection } from 'mysql2/promise';

export async function connectDatabase(): Promise<Connection> {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root_password',
        database: 'easyMeals'
    });
}
