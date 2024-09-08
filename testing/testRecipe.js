import { 
    deleteRequest, 
    getRequest, 
    handleCreate, 
    handleDelete, 
    handleGet, 
    handleGetAll, 
    handleUpdate, 
    LOCALHOST, 
    patchRequest, 
    postRequest } from "./utils.js";

const recipeRoute = LOCALHOST + "recipes/";

export async function testCreateRecipe() {
    console.log('testing Create Recipe');
    const testName = "recipe" + (Math.round(Math.random() * 10000));
    return await postRequest(recipeRoute, {
        name: testName 
    });
}

export async function testGetRecipe(id) {
    console.log('testing Get Recipe');
    return getRequest(recipeRoute + id);

}

export async function testGetAllRecipe() {
    console.log('testing Get All Recipe');
    return getRequest(recipeRoute);
}

export async function testUpdateRecipe(id) {
    console.log('testing Update Recipe');
    return await patchRequest(recipeRoute + id, {
        draftFlag: false
    });
}

export async function testDeleteRecipe(id) {
    console.log('testing Delete Recipe');
    return await deleteRequest(recipeRoute + id);
}

export function handleTestCreateRecipe(res) {
    handleCreate(res, 'Recipe', 'Recipe created successfully');
}

function isRecipe(r) {
    if (r &&
        r.ID &&
        r.createdTime &&
        r.modifiedTime &&
        r.name &&
        r.draftFlag) {
        return true;
    } 
    return false;
}

export function handleTestGetRecipe(res) {
    handleGet(res, 'recipe', isRecipe);
} 

export function handleTestGetAllRecipe(res) {
    handleGetAll(res, 'recipes', isRecipe);
}

export function handleTestUpdateRecipe(res) {
    handleUpdate(res, 'recipe');
}

export function handleTestDeleteRecipe(res) {
    handleDelete(res, 'Recipe');
}

export async function recipeCreateTest() {
    /*
    *=======================
    * person logs in
    * session token is created in DB, linked to User
    * session token is returned and stored in cookie
    * person creates new recipe
    * Recipe is created in DB, draft flag set to true
    * User is linked to new Recipe
    */

    console.log("Starting Recipe Create Test");
    const resCreateRecipe = await testCreateRecipe();
    handleTestCreateRecipe(resCreateRecipe);
    const resGetRecipe = await testGetRecipe(resCreateRecipe.data.id);
    handleTestGetRecipe(resGetRecipe);
    const resUpdateRecipe = await testUpdateRecipe(resCreateRecipe.data.id);
    handleTestUpdateRecipe(resUpdateRecipe);
    const resDeleteRecipe = await testDeleteRecipe(resCreateRecipe.data.id);
    handleTestDeleteRecipe(resDeleteRecipe);
    const resGetAllRecipe = await testGetAllRecipe();
    handleTestGetAllRecipe(resGetAllRecipe);
    console.log("Ending Recipe Create Test");

}
