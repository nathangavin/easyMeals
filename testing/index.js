import { testGetUser, testCreateUser, testLoginUser } from './testUser.js';

main();

async function main() {
    const res = await testCreateUser();
    await testGetUser(res.id);
    await testLoginUser(res.email, res.password);
    await testGetUser(res.id);
}
