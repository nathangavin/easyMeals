import { LOCALHOST, get, post } from './utils.js';

const sessionRoute = LOCALHOST + "sessions/";

export async function testCreateSession(email, password) {
    return await post(sessionRoute, {
        email: email,
        password: password
    });
}

export function handleTestCreateSession(res) {
    console.assert(res.status == 200,
                    "Session Create: incorrect status: %s", res.status);
    console.assert(res.data.session,
                    "Session Create: session value is missing: %o", res.data.session);
}

