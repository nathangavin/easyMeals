import { 
    handleTestCreateRecipe, 
    handleTestCreateUserRecipe, 
    testCreateRecipe, 
    testCreateUserRecipe } from './testRecipe.js';
import { 
    handleTestCreateSession, 
    handleTestDeleteSession, 
    handleTestGetSession, 
    testCreateSession, 
    testDeleteSession, 
    testGetSession } from './testSession.js';
import { 
    testGetUser, 
    testCreateUser, 
    testUpdateUser,
    handleTestCreateUser,
    handleTestGetUser,
    handleTestUpdateUser,
    setupTestUser} from './testUser.js';

main();

async function main() {
    printBreaker();
    await userLoginTest();
    printBreaker();
    await recipeCreateTest();
    printBreaker();
}

async function userLoginTest() {
    /*
    * =======================
    * person creates new account
    * User is created in DB
    * person is forced to login
    * login session token is created in DB and linked to User
    * session token is returned and stored in cookie
    * person edits User
    * user update request is authenticated against session
    * person logs out
    * log out request is authenticated
    * session token is deleted from DB
    */
    console.log('Starting User Login Test');
    const resCreateUser = await testCreateUser();
    handleTestCreateUser(resCreateUser);
    const resGetUser = await testGetUser(resCreateUser.id);
    handleTestGetUser(resGetUser);
    const resCreateSession = await testCreateSession(resCreateUser.email, resCreateUser.password);
    handleTestCreateSession(resCreateSession);
    const resGetSession = await testGetSession(resCreateSession.data.session);
    handleTestGetSession(resGetSession);
    const resUpdateUser = await testUpdateUser(resCreateUser.id, resCreateSession.data.session);
    handleTestUpdateUser(resUpdateUser);
    const resDeleteSession = await testDeleteSession(resCreateSession.data.session);
    handleTestDeleteSession(resDeleteSession);
    console.log('Ending User Login Test');
}

async function recipeCreateTest() {
    /*
    *=======================
    * person logs in
    * session token is created in DB, linked to User
    * session token is returned and stored in cookie
    * person creates new recipe
    * Recipe is created in DB, draft flag set to true
    * User is linked to new Recipe
    */
    /*
    CREATE TABLE IF NOT EXISTS Recipes (
    ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    createdTime BIGINT NOT NULL,
    modifiedTime BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    draftFlag BOOLEAN
    */

    console.log("Starting Recipe Create Test");
    const resCreateRecipe = await testCreateRecipe();
    handleTestCreateRecipe(resCreateRecipe);
    const resSetupUser = await setupTestUser();
    const resCreateRecipeByUser = await testCreateUserRecipe();
    handleTestCreateUserRecipe(resCreateRecipeByUser);
    console.log("Ending Recipe Create Test");
}

function printBreaker() {
    console.log('================================');
}
