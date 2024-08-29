import { LOCALHOST } from "./utils.js";

const userRecipeRoute = LOCALHOST + "userrecipes/";

export async function testCreateUserRecipe(userId, recipeId) {
    console.log('testing Create UserRecipe');
}

export async function testGetUserRecipe(id) {
    console.log('testing Get UserRecipe');
}

export async function testDeleteUserRecipe(id) {
    console.log('testing Delete UserRecipe');
}

export function handleTestCreateUserRecipe(res) {
    console.assert(false, "UserRecipe create: not finished");
}

export function handleTestGetUserRecipe(res) {
    console.assert(false, "UserRecipe get: not finished");
}

export function handleTestDeleteUserRecipe(res) {
    console.assert(false, "UserRecipe delete: not finished");
}
