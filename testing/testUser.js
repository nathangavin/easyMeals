import { LOCALHOST, 
        getRequest, 
        handleCreate, 
        handleGet, 
        postRequest, 
        putRequest } from './utils.js';
import { testCreateSession } from './testSession.js';

const userRoute = LOCALHOST + "users/";

export function generateTestUserDetails() {
    console.log("generating test user");
    return {
        email: 'test' + Math.floor(Math.random()*100000) + "@test.com",
        password: 'TestPassword1616',
        firstname: 'test1',
        lastname: 'test2'
    };
}

export async function testCreateUser(userDetails) {
    console.log("testing Create User");
    return await postRequest(userRoute, userDetails);
}

export async function testGetUser(id) {
    console.log("testing Get User");
    return await getRequest(userRoute + id);
}

export async function testUpdateUser(id, sessionToken) {
    console.log("testing Update User");
    return await putRequest(userRoute + id, {
        firstname: 'testnamechanged'
    }, sessionToken);

}

export async function setupTestUser() {
    console.log("setting up test User");
    const resUser = await testCreateUser();
    const resSession = await testCreateSession(resUser.email, resUser.password);

    return {
        id: resUser.id,
        email: resUser.email,
        password: resUser.password,
        session: resSession.data.session
    }
}

export function handleTestCreateUser(res) {
    handleCreate(res, 'user', 'User created successfully');
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

export function handleTestGetUser(res) {
    handleGet(res, 'user', isUser);
}

export function handleTestUpdateUser(res) {
    handleUpdate(res, 'recipe');
}

