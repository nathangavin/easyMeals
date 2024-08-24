import { LOCALHOST, postRequest } from "./utils.js";

const recipeRoute = LOCALHOST + "recipes/";

export async function testCreateRecipe() {
    console.log('testing Create Recipe');
    const testName = "recipe" + (Math.round(Math.random() * 10000));
    const recipeResponse = await postRequest(recipeRoute, {
        name: testName 
    });
    return {
        name: testName,
        response: recipeResponse
    };
}

export async function testGetRecipe(id) {
    console.log('testing Get Recipe');
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

export function handleTestGetRecipe(res) {
    console.assert(false, "Recipe get: not finished");
}

export function handleTestUpdateRecipe(res) {
    console.assert(false, "Recipe update: not finished");
}

export function handleTestDeleteRecipe(res) {
    console.assert(false, "Recipe delete: not finished");
}
