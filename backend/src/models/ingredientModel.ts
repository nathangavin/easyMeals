import { ResultSetHeader } from 'mysql2';
import { connectDatabase, generateCreateSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';
import UnitModel from './unitModel';

class IngredientModel {
    
    private static genericErrorMessage = 'Unknown Error';

    static async create(name: string, unitID: number): 
                Promise<Status<StatusType, number | undefined>> {
        
        const unit = await UnitModel.get(unitID);
        if (unit.status == StatusType.Empty) {
            return {
                status: StatusType.Missing,
                message: 'UnitID does not exist'
            };
        }

        const connection = await connectDatabase();
        const createdTime = Date.now();
        const modifiedTime = createdTime;
        const columnData = [
            ['createdTime', createdTime],
            ['modifiedTime', modifiedTime],
            ['name', name],
            ['unitID', unitID]
        ];
        try {
            const query = generateCreateSQLStatement('Ingredients', columnData);
            const [result] = await connection.execute<ResultSetHeader>(query);
            return {
                status: StatusType.Success,
                value: result.insertId
            };
        } catch (error) {
            return {
                status: StatusType.Failure,
                message: IngredientModel.errorMessage(error) 
            };
        } finally {
            await connection.end();
        }
    }

    static async get(id: number): 
            Promise<Status<StatusType, object | undefined>> {

        const connection = await connectDatabase();
        try {
            const query = `SELECT * FROM Ingredients WHERE ID = ${id}`;
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
                message: IngredientModel.errorMessage(error)
            }
        } finally {
            await connection.end();
        }
    }

    private static errorMessage(error: any): string {
        return error instanceof Error ? error.message : IngredientModel.genericErrorMessage;
    }
} 

export default UnitModel; 


