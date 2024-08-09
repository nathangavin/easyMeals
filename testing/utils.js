export const LOCALHOST = "http://localhost:3000/api/";

export async function post(url, body) {
    const rawResponse = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json',
            "Accept": 'application/json'

        }
    });

    const content = await rawResponse.json();
    
    return {
        status: rawResponse.status,
        data: content
    };
}

export async function get(url) {
    const rawResponse = await fetch(url);

    const content = await rawResponse.json();
    
    return {
        status: rawResponse.status,
        data: content
    };
}
