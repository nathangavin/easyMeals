import { handleTestCreateSession, 
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
    handleTestUpdateUser} from './testUser.js';

async function main() {
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

main();
