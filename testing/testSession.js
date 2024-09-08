import { LOCALHOST, 
    deleteRequest, 
    getRequest, 
    handleDelete, 
    handleGet, 
    handleGetAll405, 
    handleUpdate405, 
    patchRequest, 
    postRequest } from './utils.js';

// ============ Utils ==================

const sessionRoute = LOCALHOST + "sessions/";

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

// ============= Test Functions ================

export async function testCreateSession(email, password) {
    return await postRequest(sessionRoute, {
        email: email,
        password: password
    });
}

export async function testGetSession(id) {
    return await getRequest(sessionRoute + id);
}

export async function testGetAllSession() {
    return getRequest(sessionRoute);
}

export async function testUpdateSession(session) {
    return await patchRequest(sessionRoute + session);
}

export async function testDeleteSession(session) {
    return await deleteRequest(sessionRoute + session);
}

// ============== Handle Functions ===============

export function handleTestCreateSession(res) {
    console.log('testing Create Session');
    // needs unique logic because create session returns token rather than id
    console.assert(res.status == 200,
                    "Session Create: incorrect status: %s", res.status);
    console.assert(res.data.session,
                    "Session Create: session value is missing: %o", res.data.session);
}

export function handleTestGetSession(res) {
    console.log('testing Get Session');
    handleGet(res, 'session', isSession);
}

export function handleTestGetAllSession(res) {
    console.log('testing Get All Session');
    handleGetAll405(res, 'sessions');
}

export function handleTestUpdateSession(res) {
    console.log('testing Update Session');
    handleUpdate405(res, 'Session');
}

export async function handleTestDeleteSession(res) {
    console.log('testing Delete Session');
    handleDelete(res, 'Session');
}

