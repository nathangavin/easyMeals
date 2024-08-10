import { handleTestCreateSession, 
        handleTestDeleteSession, 
        handleTestGetSession, 
        testCreateSession, 
        testDeleteSession, 
        testGetSession } from './testSession.js';
import { 
    testGetUser, 
    testCreateUser, 
    handleTestCreateUser,
    handleTestGetUser} from './testUser.js';

async function main() {
    /*
    * =======================
    * person creates new account
    * User is created in DB
    * person is forced to login
    * login session token is created in DB and linked to User
    * session token is returned and stored in cookie
    * person logs out
    * log out request is authenticated
    * session token is deleted from DB
    */
    console.log('Starting User Login Test');
    const res = await testCreateUser();
    handleTestCreateUser(res);
    const res2 = await testGetUser(res.id);
    handleTestGetUser(res2);
    const res3 = await testCreateSession(res.email, res.password);
    handleTestCreateSession(res3);
    const res4 = await testGetUser(res.id);
    handleTestGetUser(res4);
    const res5 = await testGetSession(res4.data.user.loginSessionID);
    handleTestGetSession(res5);
    const res6 = await testDeleteSession(res3.data.session);
    handleTestDeleteSession(res6);
    console.log('Ending User Login Test');
}

main();
