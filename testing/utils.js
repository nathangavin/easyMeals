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

