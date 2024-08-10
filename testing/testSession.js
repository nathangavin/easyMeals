import { LOCALHOST, deleteRequest, getRequest, postRequest } from './utils.js';

const sessionRoute = LOCALHOST + "sessions/";

export async function testCreateSession(email, password) {
    return await postRequest(sessionRoute, {
        email: email,
        password: password
    });
}

export async function testGetSession(id) {
    return await getRequest(sessionRoute + id);
}

export async function testDeleteSession(session) {
    return await deleteRequest(sessionRoute + session);
}

export function handleTestCreateSession(res) {
    console.assert(res.status == 200,
                    "Session Create: incorrect status: %s", res.status);
    console.assert(res.data.session,
                    "Session Create: session value is missing: %o", res.data.session);
}

export function handleTestGetSession(res) {
    console.assert(res.status == 200,
                    "Session get: incorrect status %s", res.status);
    console.assert(res.data.session,
                    "Session get: session value is missing: %o", res.data.session);
}

export async function handleTestDeleteSession(res) {
    console.assert(false, "Session Delete: incorrect status %s", res.status);
    console.assert(false, "Session Delete: TODO missing data");
}

