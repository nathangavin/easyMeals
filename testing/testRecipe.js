import { assertResponseStatus, getRequest, handleGet, LOCALHOST, postRequest } from "./utils.js";

const recipeRoute = LOCALHOST + "recipes/";

export async function testCreateRecipe() {
    console.log('testing Create Recipe');
    const testName = "recipe" + (Math.round(Math.random() * 10000));
    const recipeResponse = await postRequest(recipeRoute, {
        name: testName 
    });
    return {
        id: recipeResponse.data.id,
        name: testName,
        response: recipeResponse
    };
}

export async function testGetRecipe(id) {
    console.log('testing Get Recipe');
    return await getRequest(recipeRoute + id);

}

export async function testUpdateRecipe(id) {
    console.log('testing Update Recipe');
}

export async function testDeleteRecipe(id) {
    console.log('testing Delete Recipe');
}

export function handleTestCreateRecipe(res) {
    console.assert(res.response.status == 201,
                    "Recipe create: incorrect status: %s", res.response.status);
    console.assert(res.response.data.message == 'Recipe created successfully',
                    "Recipe create: incorrect message: '%s'",
                    res.response.data.message);
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
    /*
    assertResponseStatus('Recipe', 'Get', 200, res.status);
    console.assert(isRecipe(res.data.recipe),
                    "Recipe Get: returned data is incorrect format %o",
                    res.data.recipe);
    */
    handleGet(res, 'recipe', isRecipe);
}

export function handleTestUpdateRecipe(res) {
    console.assert(false, "Recipe update: not finished");
}

export function handleTestDeleteRecipe(res) {
    console.assert(false, "Recipe delete: not finished");
}
