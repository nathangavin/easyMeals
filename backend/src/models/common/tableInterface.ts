import { createReturn, 
        getAllReturn, 
        getReturn, 
        updateDeleteReturn} from '../../utils/databaseConnection';

export interface DbCommon {
    ID: number | undefined,
    createdTime: number,
    modifiedTime: number,
}

export interface DbNames {
    tableName: string,
    messageName: string,
    fieldName: string,
    multipleFieldName: string
}

export type DbCommonConstructor<T extends DbCommon> = new (...args: any[]) => T;

export function createDbCommonInstance<T extends DbCommon>(constructor: DbCommonConstructor<T>, ...args: any[]): T {
    return new constructor(...args);
}

export type DbInterface<T extends DbCommon> = CanCreate<T> &
                                                CanGet<T> &
                                                CanGetAll<T> &
                                                CanExists & 
                                                CanUpdate<T> &
                                                CanDelete;

export interface CanCreate<T extends DbCommon> {
    create(input: T): Promise<createReturn>
}

export interface CanGet<T extends DbCommon> {
    get(id: number): Promise<getReturn<T>>
}

export interface CanGetAll<T extends DbCommon> {
    getAll(): Promise<getAllReturn<T>>
}

export interface CanExists {
    exists(id: number): Promise<boolean>
}

export interface CanUpdate<T extends DbCommon> {
    update(id: number, record: T): Promise<updateDeleteReturn>
}

export interface CanDelete {
    delete(id: number): Promise<updateDeleteReturn>
}
