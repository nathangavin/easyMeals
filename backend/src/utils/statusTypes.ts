export enum StatusType {
    Success = 'success',
    Failure = 'failure',
    Empty = 'empty'
}

export type Status<T extends StatusType, U = undefined> = 
        T extends StatusType.Success 
            ? {
                status: T;
                value: U;
            } : T extends StatusType.Empty 
                ? {
                    status: T
                } : {
                    status: T;
                    message: string
                };


