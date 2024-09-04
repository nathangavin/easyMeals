import { getRequest, 
        postRequest, 
        patchRequest, 
        deleteRequest, 
        LOCALHOST, 
        handleCreate,
        handleGet,
        handleDelete,
        handleUpdate405} from "./utils.js";
import { setupTestUser } from "./testUser.js";
import { testCreatePantry } from "./testPantry.js";

const userPantryRoute = LOCALHOST + "userpantries/";

export async function testCreateUserPantry(userID, pantryID) {
    console.log('testing Create UserPantry');
    return await postRequest(userPantryRoute, {
        userID,
        pantryID,
    });
}

export async function testGetUserPantry(id) {
    console.log('testing Get UserPantry');
    return await getRequest(userPantryRoute + id);
}

export async function testUpdateUserPantry(id) {
    console.log('testing Update UserPantry');
    return await patchRequest(userPantryRoute + id);
}

export async function testDeleteUserPantry(id, session) {
    console.log('testing Delete UserPantry');
    return await deleteRequest(userPantryRoute + id, session);
}

export function handleTestCreateUserPantry(res) {
    handleCreate(res, 'userPantry', "UserPantry created successfully");
}

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

export function handleTestGetUserPantry(res) {
    handleGet(res, 'userPantry', isUserPantry);
}

export function handleTestUpdateUserPantry(res) {
    handleUpdate405(res, 'userPantry');
}

export function handleTestDeleteUserPantry(res) {
    handleDelete(res, 'userPantry');
}

export async function userPantryCreateTest() {
    /*
    * ==================
    * person logs in.
    * user creates userPantry.
    * userPantry is linked to user and recipe.
    */
    console.log("Starting UserPantry Create Test");
    const resSetupUser = await setupTestUser();
    const resCreatePantry = await testCreatePantry('testPantry');
    const resCreateUserPantry = await testCreateUserPantry(resSetupUser.id, 
                                                    resCreatePantry.data.id);
    handleTestCreateUserPantry(resCreateUserPantry);
    const resGetUserPantry = await testGetUserPantry(resCreateUserPantry.data.id);
    handleTestGetUserPantry(resGetUserPantry);
    const resUpdateUserPantry = await testUpdateUserPantry(
                                                resCreateUserPantry.data.id);
    handleTestUpdateUserPantry(resUpdateUserPantry);
    const resDeleteUserPantry = await testDeleteUserPantry(
                                                resCreateUserPantry.data.id, 
                                                resSetupUser.session);
    handleTestDeleteUserPantry(resDeleteUserPantry);
    console.log("Ending UserPantry Create Test");
}
