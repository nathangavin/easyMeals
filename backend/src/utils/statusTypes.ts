export enum StatusType {
    Success = 'success',
    Failure = 'failure',
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


