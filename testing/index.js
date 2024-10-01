import { recipeCreateTest } from './testRecipe.js';
import { userLoginTest } from './testUser.js';
import { userRecipeCreateTest } from './testUserRecipe.js';
import { unitCreateTest } from './testUnit.js';
import { pantryCreateTest } from './testPantry.js';
import { ingredientCreateTest } from './testIngredient.js';
import { instructionCreateTest } from './testInstruction.js';
import { ingredientQuantityCreateTest } from './testIngredientQuantity.js';
import { instructionIngredientQuantityCreateTest } from './testInstructionIngredientQuantity.js';
import { userPantryCreateTest } from './testUserPantry.js';
import { pantryIngredientQuantityCreateTest } from './testPantryIngredientQuantity.js';
import { getRequest, LOCALHOST, postRequest } from './utils.js';
import { testTest } from './testTest.js';

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
    await ingredientCreateTest();
    printBreaker();
    await instructionCreateTest();
    printBreaker();
    await ingredientQuantityCreateTest();
    printBreaker();
    await instructionIngredientQuantityCreateTest();
    printBreaker();
    await userPantryCreateTest();
    printBreaker();
    await pantryIngredientQuantityCreateTest();
    printBreaker();
    await testTest();
}

function printBreaker() {
    console.log('================================');
}
