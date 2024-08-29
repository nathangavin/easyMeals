import { createReturn, getReturn, updateDeleteReturn } from "./databaseConnection";
import { INTERNAL_SERVER_ERROR_MSG, 
    RECORD_CREATED_SUCCESSFULLY_MSG, 
    UNREACHABLE_CODE_UNKNOWN_STATUS_MSG } from "./messages";
import { StatusType } from "./statusTypes";

export function handleCreateResponse(
                        dbResponse: createReturn,
                        messageName: string) : { status: number, json: object} {
    console.log(dbResponse);
    switch (dbResponse.status) {
        case StatusType.Success:
            return {
                status: 201,
                json: {
                    message: RECORD_CREATED_SUCCESSFULLY_MSG(messageName),
                    id: dbResponse.value
                }
            };
        case StatusType.Failure:
            return {
                status: 500,
                json: {
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: dbResponse.message
                }
            };
        default:
            return {
                status: 500,
                json: {
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG(
                                                            messageName,
                                                            'Create',
                                                            dbResponse.status)
                }
            };
    }
}

export function handleGetResponse<T>(
                        dbResponse: getReturn<T>,
                        fieldname: string,
                        messageName: string) : { status: number, json: object } {


    console.log(dbResponse);
    switch(dbResponse.status) {
        case StatusType.Success:
            return {
                status: 200,
                json: Object.fromEntries([[fieldname, dbResponse.value]])
            };
        case StatusType.Failure: 
            return {
                status: 500,
                json: {
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: dbResponse.message
                }
            };
        case StatusType.Missing:
            return {
                status: 404,
                json: {
                    message: dbResponse.message
                }
            };
        default:
            return {
                status: 500,
                json: {
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG(messageName, 'Get')
                }
            };
    }
}

export function handleUpdateDeleteResponse(
                        dbResponse: updateDeleteReturn, 
                        responseTypeName: string,
                        messageName: string) : { status: number, json: object } {

    console.log(dbResponse);
    switch(dbResponse.status) {
        case StatusType.Success:
            return {
                status: 204,
                json: {}
            };
        case StatusType.Missing:
            return {
                status: 404,
                json: {
                    message: dbResponse.message
                }
            };
        case StatusType.Failure:
            return {
                status: 500,
                json: {
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: dbResponse.message
                }
            };
        default:
            return {
                status: 500,
                json: {
                    error: INTERNAL_SERVER_ERROR_MSG,
                    message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG(messageName, responseTypeName)
                }
            };
    }
}

