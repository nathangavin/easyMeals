/** StatusType - Used for defining Database results
*
* Success - used for when CRUD request to database is successful
* Failure - used exclusively for handling errors generated from DB query
* Missing - used for queries that require finding a record, and is returned
*           when the required record cannot be found.
*/
export enum StatusType {
    Success = 'success',
    Failure = 'failure',
    Missing = 'missing'
}

export type Status<T extends StatusType, U = undefined> = 
        T extends StatusType.Success 
            ? {
                status: T;
                value: U;
            } : {
                status: T;
                message: string
            };
