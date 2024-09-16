import { getRequest, 
        postRequest, 
        patchRequest, 
        deleteRequest, 
        LOCALHOST, 
        handleCreate,
        handleGet,
        handleDelete,
        handleUpdate405,
        handleGetAll} from "./utils.js";
import { setupTestUser } from "./testUser.js";
import { testCreatePantry, testDeletePantry } from "./testPantry.js";

// ============== Utils =================

const userPantryRoute = LOCALHOST + "userpantries/";

function isUserPantry(u) {
    if (u &&
        u.ID &&
        u.createdTime &&
        u.modifiedTime &&
        u.userID &&
        u.pantryID) {
        return true;
    }
    return false;
}

// ============= Test functions ==============

export async function testCreateUserPantry(userID, pantryID) {
    return await postRequest(userPantryRoute, {
        userID,
        pantryID,
    });
}

export async function testGetUserPantry(id) {
    return await getRequest(userPantryRoute + id);
}

export async function testGetAllUserPantry() {
    return getRequest(userPantryRoute);
}

export async function testUpdateUserPantry(id) {
    return await patchRequest(userPantryRoute + id);
}

export async function testDeleteUserPantry(id, session) {
    return await deleteRequest(userPantryRoute + id, session);
}

async function setupForGetAll(id1, id2) {
    const res1 = await testCreateUserPantry(id1, id2);
    const res2 = await testCreateUserPantry(id1, id2);
    const res3 = await testCreateUserPantry(id1, id2);
    const res4 = await testCreateUserPantry(id1, id2);
    const res5 = await testCreateUserPantry(id1, id2);
    
    return [
        res1.data.id,
        res2.data.id,
        res3.data.id,
        res4.data.id,
        res5.data.id,
    ];
}

async function deleteForGetAll(ids) {
    for (const id of ids) {
        await testDeleteUserPantry(id);
    }
}

// =========== Handle Functions =================

export function handleTestCreateUserPantry(res) {
    console.log('testing Create UserPantry');
    handleCreate(res, 'userPantry', "UserPantry created successfully");
}

export function handleTestGetUserPantry(res) {
    console.log('testing Get UserPantry');
    handleGet(res, 'userPantry', isUserPantry);
}

export function handleTestGetAllUserPantry(res) {
    console.log('testing Get All UserPantry');
    handleGetAll(res, 'userPantries', isUserPantry);
}

export function handleTestUpdateUserPantry(res) {
    console.log('testing Update UserPantry');
    handleUpdate405(res, 'userPantry');
}

export function handleTestDeleteUserPantry(res) {
    console.log('testing Delete UserPantry');
    handleDelete(res, 'userPantry');
}

// ========== Summary function ==============

async function setupTestConditions() {
    const resSetupUser = await setupTestUser();
    const resCreatePantry = await testCreatePantry('testPantry');
    
    return {
        user: resSetupUser,
        pantryID: resCreatePantry.data.id
    };
}

async function cleanUpTestConditions(setup) {
    await testDeletePantry(setup.pantryID);
}

export async function userPantryCreateTest() {
    /*
    * ==================
    * person logs in.
    * user creates userPantry.
    * userPantry is linked to user and recipe.
    */
    console.log("Starting UserPantry Create Test");
    const setup = await setupTestConditions();
    const resCreateUserPantry = await testCreateUserPantry(setup.user.id, 
                                                        setup.pantryID);
    handleTestCreateUserPantry(resCreateUserPantry);
    const resGetUserPantry = await testGetUserPantry(resCreateUserPantry.data.id);
    handleTestGetUserPantry(resGetUserPantry);
    const resUpdateUserPantry = await testUpdateUserPantry(
                                                resCreateUserPantry.data.id);
    handleTestUpdateUserPantry(resUpdateUserPantry);
    const resDeleteUserPantry = await testDeleteUserPantry(
                                                resCreateUserPantry.data.id, 
                                                setup.user.session);
    handleTestDeleteUserPantry(resDeleteUserPantry);

    const getAllIds = await setupForGetAll(setup.user.id, setup.pantryID);

    const resGetAllUserPantry = await testGetAllUserPantry();
    handleTestGetAllUserPantry(resGetAllUserPantry);
    
    await deleteForGetAll(getAllIds);

    await cleanUpTestConditions(setup);

    console.log("Ending UserPantry Create Test");
}
