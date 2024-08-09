import { 
    testGetUser, 
    testCreateUser, 
    testLoginUser, 
    handleTestCreateUser,
    handleTestGetUser,
    handleTestLoginUser } from './testUser.js';

main();

async function main() {
    console.log('Starting User Login Test');
    const res = await testCreateUser();
    handleTestCreateUser(res);
    const res2 = await testGetUser(res.id);
    handleTestGetUser(res2);
    const res3 = await testLoginUser(res.email, res.password);
    handleTestLoginUser(res3);
    const res4 = await testGetUser(res.id);
    handleTestGetUser(res4);
    console.log('Ending User Login Test');
}
