import { LOCALHOST, get, post } from './utils.js';

const userRoute = LOCALHOST + "users/";

export async function testCreateUser() {
    const testEmail = 'test' + Math.floor(Math.random()*100) + "@test.com";
    const password = 'TestPassword1616';

    const userResponse = await post(userRoute, {
        firstname: 'test1',
        lastname: 'test2',
        email: testEmail,
        password: password
    });
    console.log(userResponse);
    return {
        id: userResponse.data.id,
        email: testEmail,
        password: password
    };
}

export async function testGetUser(id) {
    const userResponse = await get(userRoute + id);
    console.log(userResponse);
}

export async function testLoginUser(email, password) {
    const loginResponse = await post(userRoute + 'login', {
        email: email,
        password: password
    });
    console.log(loginResponse);
}
