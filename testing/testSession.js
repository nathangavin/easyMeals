import { LOCALHOST, deleteRequest, getRequest, handleGet, postRequest } from './utils.js';

const sessionRoute = LOCALHOST + "sessions/";

export async function testCreateSession(email, password) {
    console.log('testing Create Session');
    return await postRequest(sessionRoute, {
        email: email,
        password: password
    });
}

export async function testGetSession(id) {
    console.log('testing Get Session');
    return await getRequest(sessionRoute + id);
}

export async function testDeleteSession(session) {
    console.log('testing Delete Session');
    return await deleteRequest(sessionRoute + session);
}

export function handleTestCreateSession(res) {
    console.assert(res.status == 200,
                    "Session Create: incorrect status: %s", res.status);
    console.assert(res.data.session,
                    "Session Create: session value is missing: %o", res.data.session);
}

function isSession(s) {
    if (s &&
        s.ID &&
        s.createdTime &&
        s.modifiedTime &&
        s.token &&
        s.expiryTime &&
        s.UserID) {
        return true;
    }
    return false;
}

export function handleTestGetSession(res) {
    /*
    console.assert(res.status == 200,
                    "Session get: incorrect status %s", res.status);
    console.assert(res.data.session,
                    "Session get: session value is missing: %o", res.data.session);
    */
    handleGet(res, 'session', isSession);
}

export async function handleTestDeleteSession(res) {
    console.assert(res.status == 204, "Session Delete: incorrect status %s", res.status);
}

