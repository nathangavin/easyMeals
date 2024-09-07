export const LOCALHOST = "http://localhost:3000/api/";

export async function postRequest(url, body, token) {
    let headers = {
        "Content-type": 'application/json',
        "Accept": 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const rawResponse = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    });

    let content = null;
    try {
        content = await rawResponse.json();
    } catch (error) {
        content = null;
    }

    return {
        status: rawResponse.status,
        data: content 
    };
}

export async function patchRequest(url, body, token) {
    let headers = {
        "Content-type": "application/json",
        "Accept": "application/json"
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const rawResponse = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: headers
    });
    let content = null;
    try {
        content = await rawResponse.json();
    } catch (error) {
        content = null;
    }

    return {
        status: rawResponse.status,
        data: content
    };
}

export async function getRequest(url) {
    const rawResponse = await fetch(url);

    const content = await rawResponse.json();
    
    return {
        status: rawResponse.status,
        data: content
    };
}

export async function deleteRequest(url, token) {
    let headers = {};
    if (token) {
        headers = {
            'Authorization': `Bearer ${token}`
        }
    }
    const rawResponse = await fetch(url, {
        method: 'DELETE',
        headers: headers
    });

    return {
        status: rawResponse.status,
    };
}

export function assertResponseStatus(tableName, responseType, desiredStatus, actualStatus) {
    console.assert(actualStatus == desiredStatus,
                "%s %s: incorrect status: %s", tableName, responseType, actualStatus);
}

export function handleCreate(res, tablename, expectedMessage) {
    assertResponseStatus(tablename, 'CREATE', 201, res.status);
    console.assert(res.data.message == expectedMessage,
                "%s create: incorrect message: '%s'",
                tablename,
                res.data.message ?? res.data.error);
}

export function handleGet(res, tablename, isObjectFunction) {
    assertResponseStatus(tablename, 'GET', 200, res.status);
    console.assert(isObjectFunction(res.data[tablename]), 
                "%s Get: returned data is incorrect format %o",
                tablename, res.data[tablename]);
}

export function handleGetAll(res, tablename, isObjectFunction) {
    assertResponseStatus(tablename, 'GET', 200, res.status);
    for (const val of res.data[tablename]) {
        console.assert(isObjectFunction(val),
                "%s Get All: returned object is incorrect format %o",
                tablename, val);
    }
}

export function handleUpdate(res, tablename) {
    assertResponseStatus(tablename, 'UPDATE', 204, res.status);
    console.assert(res.data == null, 
                    "%s update: incorrect message: '%s'",
                    tablename,
                    res.data?.message);
}

export function handleUpdate405(res, tablename) {
    assertResponseStatus(tablename, "UPDATE", 405, res.status);
}

export function handleDelete(res, tablename) {
    console.assert(res.status == 204, 
                    "%s Delete: incorrect status %s", 
                    tablename, 
                    res.status);
}


