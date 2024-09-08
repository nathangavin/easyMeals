import { getRequest, 
        postRequest, 
        patchRequest, 
        deleteRequest, 
        LOCALHOST, 
        handleCreate,
        handleGet,
        handleUpdate,
        handleDelete,
        handleGetAll} from "./utils.js";
import { setupTestUser } from "./testUser.js";
import { testCreateRecipe } from "./testRecipe.js";

// =========== Utils ===================

const userRecipeRoute = LOCALHOST + "userrecipes/";

function isUserRecipe(u) {
    if (u &&
        u.ID &&
        u.createdTime &&
        u.modifiedTime &&
        u.userID &&
        u.recipeID &&
        u.rating) {
        return true;
    }
    return false;
}

// ============== Test Functions ===============

export async function testCreateUserRecipe(userID, recipeID) {
    const rating = Math.ceil(Math.random() * 10);
    return await postRequest(userRecipeRoute, {
        userID,
        recipeID,
        rating
    });
}

export async function testGetUserRecipe(id) {
    return await getRequest(userRecipeRoute + id);
}

export async function testGetAllUserRecipe() {
    return getRequest(userRecipeRoute);
}

export async function testUpdateUserRecipe(id, session) {
    return await patchRequest(userRecipeRoute + id, {
        rating: 5
    }, session);
}

export async function testDeleteUserRecipe(id, session) {
    return await deleteRequest(userRecipeRoute + id, session);
}

async function setupForGetAll(id1, id2) {
    const res1 = await testCreateUserRecipe(id1, id2);
    const res2 = await testCreateUserRecipe(id1, id2);
    const res3 = await testCreateUserRecipe(id1, id2);
    const res4 = await testCreateUserRecipe(id1, id2);
    const res5 = await testCreateUserRecipe(id1, id2);
    
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
        await testDeleteUserRecipe(id);
    }
}

// =========== Handle Functions =================

export function handleTestCreateUserRecipe(res) {
    console.log('testing Create UserRecipe');
    handleCreate(res, 'userRecipe', "UserRecipe created successfully");
}

export function handleTestGetUserRecipe(res) {
    console.log('testing Get UserRecipe');
    handleGet(res, 'userRecipe', isUserRecipe);
}

export function handleTestGetAllUserRecipe(res) {
    console.log('testing Get All UserRecipe');
    handleGetAll(res, 'userRecipes', isUserRecipe);
}

export function handleTestUpdateUserRecipe(res) {
    console.log('testing Update UserRecipe');
    handleUpdate(res, 'userRecipe');
}

export function handleTestDeleteUserRecipe(res) {
    console.log('testing Delete UserRecipe');
    handleDelete(res, 'userRecipe');
}

// ============ Summary function ==============

export async function userRecipeCreateTest() {
    /*
    * ==================
    * person logs in.
    * user creates userRecipe.
    * userRecipe is linked to user and recipe.
    */
    console.log("Starting UserRecipe Create Test");
    const resSetupUser = await setupTestUser();
    const resCreateRecipe = await testCreateRecipe();
    const resCreateUserRecipe = await testCreateUserRecipe(resSetupUser.id, 
                                                    resCreateRecipe.data.id);
    handleTestCreateUserRecipe(resCreateUserRecipe);
    const resGetUserRecipe = await testGetUserRecipe(resCreateUserRecipe.data.id);
    handleTestGetUserRecipe(resGetUserRecipe);
    const resUpdateUserRecipe = await testUpdateUserRecipe(
                                                resCreateUserRecipe.data.id, 
                                                resSetupUser.session);
    handleTestUpdateUserRecipe(resUpdateUserRecipe);
    const resDeleteUserRecipe = await testDeleteUserRecipe(
                                                resCreateUserRecipe.data.id, 
                                                resSetupUser.session);
    handleTestDeleteUserRecipe(resDeleteUserRecipe);

    const getAllIds = await setupForGetAll(resSetupUser.id, resCreateRecipe.data.id);
    const resGetAllUserRecipe = await testGetAllUserRecipe();
    handleTestGetAllUserRecipe(resGetAllUserRecipe);
    await deleteForGetAll(getAllIds);
    console.log("Ending UserRecipe Create Test");
}
