import { handleTestCreateSession, testCreateSession } from './testSession.js';
import { 
    testGetUser, 
    testCreateUser, 
    handleTestCreateUser,
    handleTestGetUser} from './testUser.js';


main();

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
    console.log('Ending User Login Test');
}
