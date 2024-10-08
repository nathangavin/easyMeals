import { LOCALHOST, 
        getRequest, 
        handleCreate, 
        handleGet, 
        handleUpdate,
        postRequest, 
        patchRequest, 
        handleGetAll405,
        handleGetAll} from './utils.js';
import { handleTestCreateSession, 
    testCreateSession,
    handleTestGetSession,
    handleTestDeleteSession,
    testGetSession,
    testDeleteSession } from './testSession.js';

// ============ Utils ===============

const userRoute = LOCALHOST + "users/";

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

// =========== Test functions ================

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
    return await postRequest(userRoute, userDetails);
}

export async function testGetUser(id) {
    return await getRequest(userRoute + id);
}

export async function testGetAllUser() {
    return getRequest(userRoute);

}

export async function testUpdateUser(id, sessionToken) {
    return await patchRequest(userRoute + id, {
        firstname: 'testnamechanged'
    }, sessionToken);

}

export async function setupTestUser() {
    console.log("setting up test User");
    const userDetails = generateTestUserDetails();
    const resUser = await testCreateUser(userDetails);
    const resSession = await testCreateSession(userDetails.email, userDetails.password);

    return {
        id: resUser.data.id,
        email: userDetails.email,
        password: userDetails.password,
        session: resSession.data.session
    }
}

// ============ Handle functions ==================

export function handleTestCreateUser(res) {
    console.log("testing Create User");
    handleCreate(res, 'user', 'User created successfully');
}

export function handleTestGetUser(res) {
    console.log("testing Get User");
    handleGet(res, 'user', isUser);
}

export function handleTestGetAllUser(res) {
    console.log('testing Get All User');
    handleGetAll(res, 'users', isUser);
}

export function handleTestUpdateUser(res) {
    console.log("testing Update User");
    handleUpdate(res, 'recipe');
}

// ============= summary function =================

export async function userLoginTest() {
    /*
    * =======================
    * person creates new account
    * User is created in DB
    * person is forced to login
    * login session token is created in DB and linked to User
    * session token is returned and stored in cookie
    * person edits User
    * user update request is authenticated against session
    * person logs out
    * log out request is authenticated
    * session token is deleted from DB
    */
    console.log('Starting User Login Test');
    const userDetails = generateTestUserDetails();
    const resCreateUser = await testCreateUser(userDetails);
    handleTestCreateUser(resCreateUser);
    const resGetUser = await testGetUser(resCreateUser.data.id);
    handleTestGetUser(resGetUser);
    const resCreateSession = await testCreateSession(userDetails.email, userDetails.password);
    handleTestCreateSession(resCreateSession);
    const resGetSession = await testGetSession(resCreateSession.data.session);
    handleTestGetSession(resGetSession);
    const resUpdateUser = await testUpdateUser(resCreateUser.data.id, resCreateSession.data.session);
    handleTestUpdateUser(resUpdateUser);
    const resDeleteSession = await testDeleteSession(resCreateSession.data.session);
    handleTestDeleteSession(resDeleteSession);
    const resGetAllUser = await testGetAllUser();
    handleTestGetAllUser(resGetAllUser);
    console.log('Ending User Login Test');
}
