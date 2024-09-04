import { LOCALHOST, 
    deleteRequest, 
    getRequest, 
    handleDelete, 
    handleGet, 
    handleUpdate405, 
    patchRequest, 
    postRequest } from './utils.js';

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

export async function testUpdateSession(session) {
    return await patchRequest(sessionRoute + session);
}

export async function testDeleteSession(session) {
    console.log('testing Delete Session');
    return await deleteRequest(sessionRoute + session);
}

export function handleTestCreateSession(res) {
    // needs unique logic because create session returns token rather than id
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
    handleGet(res, 'session', isSession);
}

export function handleTestUpdateSession(res) {
    handleUpdate405(res, 'Session');
}

export async function handleTestDeleteSession(res) {
    handleDelete(res, 'Session');
}

