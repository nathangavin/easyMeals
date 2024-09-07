import { userInfo } from "os";
import SessionModel, { TOKEN_LENGTH } from "../models/sessionModel";
import { createReturn, getMultipleReturn, getReturn, updateDeleteReturn } from "./databaseConnection";
import { AUTH_TOKEN_MALFORMED_MSG, AUTH_TOKEN_MISSING_MSG, AUTH_UNAUTHORISED_MSG, INTERNAL_SERVER_ERROR_MSG, 
    RECORD_CREATED_SUCCESSFULLY_MSG, 
    UNREACHABLE_CODE_UNKNOWN_STATUS_MSG } from "./messages";
import { StatusType } from "./statusTypes";
import { argv0 } from "process";
import { Pool } from "mysql2/typings/mysql/lib/Pool";

export type HandleResponseType = {
    status: number,
    json: object
};

export function handleCreateResponse(
                        dbResponse: createReturn,
                        messageName: string) : HandleResponseType {
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
                        messageName: string) : HandleResponseType {


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

export function handleGetAllResponse<T>(
                        dbResponse: getMultipleReturn<T>,
                        fieldname: string,
                        messageName: string) : HandleResponseType {
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
                message: UNREACHABLE_CODE_UNKNOWN_STATUS_MSG(messageName, 'GetAll')
            }
        };
    }
}

export function handleUpdateDeleteResponse(
                        dbResponse: updateDeleteReturn, 
                        responseTypeName: string,
                        messageName: string) : HandleResponseType {

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

export type AuthorizationHandleResponseType = {
    authorized: boolean,
    response: HandleResponseType
};

export async function handleAuthorization(userId: number, 
                                    authorizationHeader: string | undefined) : Promise<AuthorizationHandleResponseType> {
    if (!authorizationHeader) {
        return {
            authorized: false,
            response: {
                status: 401,
                json: {
                    message: AUTH_TOKEN_MISSING_MSG
                }
            }
        };
    }
    if (authorizationHeader.split(' ').length < 2) {
        return {
            authorized: false,
            response: {
                status: 401,
                json: {
                    message: AUTH_TOKEN_MALFORMED_MSG
                }
            }
        };
    }

    const sessionToken = authorizationHeader.split(' ')[1];
    if (sessionToken.length != TOKEN_LENGTH) {
        return {
            authorized: false,
            response: {
                status: 401,
                json: {
                    message: AUTH_TOKEN_MALFORMED_MSG
                }
            }
        };
    }

    const sessionDbResponse = await SessionModel.getByToken(sessionToken);
    if (sessionDbResponse.status != StatusType.Success) {
        return {
            authorized: false,
            response: {
                status: 401,
                json: {
                    message: AUTH_UNAUTHORISED_MSG
                }
            }
        };
    }

    if (sessionDbResponse.value?.UserID != userId) {
        return {
            authorized: false,
            response: {
                status: 401,
                json: {
                    message: AUTH_UNAUTHORISED_MSG
                }
            }
        };
    }

    return {
        authorized: true,
        response: {
            status: 200,
            json: {}
        }
    };
}

