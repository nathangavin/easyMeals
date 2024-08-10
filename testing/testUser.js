import { LOCALHOST, getRequest, postRequest } from './utils.js';

const userRoute = LOCALHOST + "users/";

export async function testCreateUser() {
    console.log("testing Create User");
    const testEmail = 'test' + Math.floor(Math.random()*100000) + "@test.com";
    const password = 'TestPassword1616';

    const userResponse = await postRequest(userRoute, {
        firstname: 'test1',
        lastname: 'test2',
        email: testEmail,
        password: password
    });
    return {
        id: userResponse.data.id,
        email: testEmail,
        password: password,
        response: userResponse
    };
}

export async function testGetUser(id) {
    console.log("testing Get User");
    return await getRequest(userRoute + id);
}


function isUser(data) {
    if (data &&
        data.ID && 
        data.createdTime &&
        data.modifiedTime &&
        data.firstname &&
        data.lastname &&
        data.email &&
        data.passwordHash) {
            return true;
    }
    return false;
}

export function handleTestCreateUser(res) {
    console.assert(res.response.status == 201, 
                    "User create: incorrect status: %s", 
                    res.response.status);
    console.assert(res.response.data.message == 'User created successfully',
                    "User create: incorrect message: '%s'",
                    res.response.data.message);
}

export function handleTestGetUser(res) {
    console.assert(res.status == 200,
                    "User get: incorrect status: %s", res.status);
    console.assert(isUser(res.data.user),
                    "User get: returned data is incorrect format: %o",
                    res.data.user);
}

