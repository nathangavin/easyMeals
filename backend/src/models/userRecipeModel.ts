import { ResultSetHeader } from 'mysql2';
import { connectDatabase, generateCreateSQLStatement } from '../utils/databaseConnection';
import { StatusType, Status } from '../utils/statusTypes';

/*
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    userID INT NOT NULL,
    recipeID INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
        */
export interface User {
    ID: number,
    createdTime: number,
    modifiedTime: number,
    userID: number,
    recipeID: number,
    rating: number,
}

class UserRecipeModel {
    
    private static genericErrorMessage = 'Unknown Error';

    static async create(name: string): 
                Promise<Status<StatusType, number | undefined>> {


    }
}

export UserRecipeModel;
