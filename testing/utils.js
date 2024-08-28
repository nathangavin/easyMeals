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

export async function putRequest(url, body, token) {
    let headers = {
        "Content-type": "application/json",
        "Accept": "application/json"
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const rawResponse = await fetch(url, {
        method: 'PUT',
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

export async function deleteRequest(url) {
    const rawResponse = await fetch(url, {
        method: 'DELETE'
    });

    return {
        status: rawResponse.status,
    };
}

export function assertResponseStatus(tableName, responseType, desiredStatus, actualStatus) {
    console.assert(actualStatus == desiredStatus,
                "%s %s: incorrect status: %s", tableName, responseType, actualStatus);
}

export function handleCreate(res, fieldname, expectedMessage) {
    assertResponseStatus(fieldname, 'CREATE', 201, res.status);
    console.assert(res.data.message == expectedMessage,
                "%s create: incorrect message: '%s'",
                fieldname,
                res.data.message);
}

export function handleGet(res, fieldname, isObjectFunction) {
    assertResponseStatus(fieldname, 'GET', 200, res.status);
    console.assert(isObjectFunction(res.data[fieldname]), 
                "%s Get: returned data is incorrect format %o",
                fieldname, res.data[fieldname]);
}

