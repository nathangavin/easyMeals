export const INTERNAL_SERVER_ERROR_MSG = 'Internal Server Error';
export const UNKNOWN_ERROR_MSG = 'Unknown Error';
export const AUTH_TOKEN_MISSING_MSG = 'Authentication token not provided';
export const AUTH_TOKEN_MALFORMED_MSG = 'Authentication token malformed';
export const AUTH_UNAUTHORISED_MSG = 'Unauthorised';
export const PASSWORD_INCORRECT_MSG = 'Password Incorrect';
export const UNREACHABLE_CODE_MSG = 'Unreachable code';

export const RECORD_CREATED_SUCCESSFULLY_MSG = (tableName: string) =>
    `${tableName} created successfully`;

export const INVALID_PARAM_MSG = (paramName: string) => {
    `Invalid Parameter: ${paramName}`;
}

export const RECORD_MISSING_MSG = (tableName: string, identifier: string) => 
    `${tableName}: ${identifier} not found`;

export const UNKNOWN_MODEL_ERROR_MSG = (modelName: string) => 
    `Uknown ${modelName} Model Error`;

export const RECORD_UPDATED_MSG = (tableName: string, identifier: string) => 
    `Updated ${tableName}: ${identifier}`;

export const RECORD_DELETED_MSG = (tableName: string, identifier: string) => 
    `Deleted ${tableName}: ${identifier}`;
