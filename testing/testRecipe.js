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

// =============== Utils =================

const recipeRoute = LOCALHOST + "recipes/";

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

// ============== test functions =============

export async function testCreateRecipe() {
    const testName = "recipe" + (Math.round(Math.random() * 10000));
    return await postRequest(recipeRoute, {
        name: testName 
    });
}

export async function testGetRecipe(id) {
    return getRequest(recipeRoute + id);

}

export async function testGetAllRecipe() {
    return getRequest(recipeRoute);
}

export async function testUpdateRecipe(id) {
    return await patchRequest(recipeRoute + id, {
        draftFlag: false
    });
}

export async function testDeleteRecipe(id) {
    return await deleteRequest(recipeRoute + id);
}

// =============== handle functions ===============

export function handleTestCreateRecipe(res) {
    console.log('testing Create Recipe');
    handleCreate(res, 'Recipe', 'Recipe created successfully');
}


export function handleTestGetRecipe(res) {
    console.log('testing Get Recipe');
    handleGet(res, 'recipe', isRecipe);
} 

export function handleTestGetAllRecipe(res) {
    console.log('testing Get All Recipe');
    handleGetAll(res, 'recipes', isRecipe);
}

export function handleTestUpdateRecipe(res) {
    console.log('testing Update Recipe');
    handleUpdate(res, 'recipe');
}

export function handleTestDeleteRecipe(res) {
    console.log('testing Delete Recipe');
    handleDelete(res, 'Recipe');
}

// ============== Summary Function ==================

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
