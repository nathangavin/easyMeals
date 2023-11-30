import { ResultSetHeader } from 'mysql2';
import { connectDatabase } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';

class UnitModel {
    
    static async create(description: string): 
                Promise<Status<StatusType, number | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = `INSERT INTO Unit (description) VALUES ("${description}");`;
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            let message = 'Unknown Error';
            if (error instanceof Error) message = error.message;
            return {
                status: StatusType.Failure,
                message: message 
            };
        } finally {
            await connection.end();
        }
    }
} 

export default UnitModel; 


