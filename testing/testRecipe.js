import { 
    assertResponseStatus, 
    deleteRequest, 
    getRequest, 
    handleCreate, 
    handleDelete, 
    handleGet, 
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
    return await getRequest(recipeRoute + id);

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

export function handleTestUpdateRecipe(res) {
    handleUpdate(res, 'recipe');
}

export function handleTestDeleteRecipe(res) {
    handleDelete(res, 'Recipe');
}
