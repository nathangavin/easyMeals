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

const userRecipeRoute = LOCALHOST + "userrecipes/";

export async function testCreateUserRecipe(userID, recipeID) {
    console.log('testing Create UserRecipe');
    const rating = Math.ceil(Math.random() * 10);
    return await postRequest(userRecipeRoute, {
        userID,
        recipeID,
        rating
    });
}

export async function testGetUserRecipe(id) {
    console.log('testing Get UserRecipe');
    return await getRequest(userRecipeRoute + id);
}

export async function testGetAllUserRecipe() {
    console.log('testing Get All UserRecipe');
    return getRequest(userRecipeRoute);
}

export async function testUpdateUserRecipe(id, session) {
    console.log('testing Update UserRecipe');
    return await patchRequest(userRecipeRoute + id, {
        rating: 5
    }, session);
}

export async function testDeleteUserRecipe(id, session) {
    console.log('testing Delete UserRecipe');
    return await deleteRequest(userRecipeRoute + id, session);
}

export function handleTestCreateUserRecipe(res) {
    handleCreate(res, 'userRecipe', "UserRecipe created successfully");
}

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

export function handleTestGetUserRecipe(res) {
    handleGet(res, 'userRecipe', isUserRecipe);
}

export function handleTestGetAllUserRecipe(res) {
    handleGetAll(res, 'userRecipes', isUserRecipe);
}

export function handleTestUpdateUserRecipe(res) {
    handleUpdate(res, 'userRecipe');
}

export function handleTestDeleteUserRecipe(res) {
    handleDelete(res, 'userRecipe');
}

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
    const resCreateUserRecipe1 = await testCreateUserRecipe(resSetupUser.id, 
                                                    resCreateRecipe.data.id);
    const resCreateUserRecipe2 = await testCreateUserRecipe(resSetupUser.id, 
                                                    resCreateRecipe.data.id);
    const resCreateUserRecipe3 = await testCreateUserRecipe(resSetupUser.id, 
                                                    resCreateRecipe.data.id);
    const resCreateUserRecipe4 = await testCreateUserRecipe(resSetupUser.id, 
                                                    resCreateRecipe.data.id);
    const resCreateUserRecipe5 = await testCreateUserRecipe(resSetupUser.id, 
                                                    resCreateRecipe.data.id);
    const resGetAllUserRecipe = await testGetAllUserRecipe();
    handleTestGetAllUserRecipe(resGetAllUserRecipe);
    const resUpdateUserRecipe1 = await testUpdateUserRecipe(
                                                resCreateUserRecipe1.data.id, 
                                                resSetupUser.session);
    const resUpdateUserRecipe2 = await testUpdateUserRecipe(
                                                resCreateUserRecipe2.data.id, 
                                                resSetupUser.session);
    const resUpdateUserRecipe3 = await testUpdateUserRecipe(
                                                resCreateUserRecipe3.data.id, 
                                                resSetupUser.session);
    const resUpdateUserRecipe4 = await testUpdateUserRecipe(
                                                resCreateUserRecipe4.data.id, 
                                                resSetupUser.session);
    const resUpdateUserRecipe5 = await testUpdateUserRecipe(
                                                resCreateUserRecipe5.data.id, 
                                                resSetupUser.session);
    console.log("Ending UserRecipe Create Test");
}
