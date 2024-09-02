import { recipeCreateTest } from './testRecipe.js';
import { userLoginTest } from './testUser.js';
import { userRecipeCreateTest } from './testUserRecipe.js';
import { unitCreateTest } from './testUnit.js';
import { pantryCreateTest } from './testPantry.js';

main()

async function main() {
    printBreaker();
    await userLoginTest();
    printBreaker();
    await recipeCreateTest();
    printBreaker();
    await userRecipeCreateTest();
    printBreaker();
    await unitCreateTest();
    printBreaker();
    await pantryCreateTest();
    printBreaker();
}

function printBreaker() {
    console.log('================================');
}
