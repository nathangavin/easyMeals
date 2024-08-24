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

export async function testCreateUserRecipe() {
    console.log('testing Create Recipe by User');
    const testName = "recipe" + (Math.round(Math.random() * 10000));
}

export async function testGetRecipe() {
    console.log('testing Get Recipe');
}

export function handleTestCreateRecipe(res) {
    console.assert(res.response.status == 201,
                    "Recipe create: incorrect status: %s", res.response.status);
    console.assert(res.response.data.message == 'Recipe created successfully',
                    "Recipe create: incorrect message: '%s'",
                    res.response.data.message);
}

export function handleTestCreateUserRecipe(res) {
    console.assert(false, "Recipe create by user: not finished");
}

export function handleTestGetRecipe(res) {
    console.assert(false, "Recipe get: not finished");
}
