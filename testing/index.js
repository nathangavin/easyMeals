const localhost = "http://localhost:3000/api/";
const unitRoute = localhost + "units/";
const userRoute = localhost + "users/";

main();

async function main() {
    const res = await testCreateUser();
    await testGetUser(res.id);
    await testLoginUser(res.email, res.password);
    await testGetUser(res.id);
}

async function testCreateUser() {
    const testEmail = 'test' + Math.floor(Math.random()*100) + "@test.com";
    const password = 'TestPassword1616';

    const userResponse = await post(userRoute, {
        firstname: 'test1',
        lastname: 'test2',
        email: testEmail,
        password: password
    });
    console.log(userResponse);
    return {
        id: userResponse.data.id,
        email: testEmail,
        password: password
    };
}

async function testGetUser(id) {
    const userResponse = await get(userRoute + id);
    console.log(userResponse);
}

async function testLoginUser(email, password) {
    const loginResponse = await post(userRoute + 'login', {
        email: email,
        password: password
    });
    console.log(loginResponse);
}

async function post(url, body) {
    const rawResponse = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json',
            "Accept": 'application/json'

        }
    });

    const content = await rawResponse.json();
    
    return {
        status: rawResponse.status,
        data: content
    };
}

async function get(url) {
    const rawResponse = await fetch(url);

    const content = await rawResponse.json();
    
    return {
        status: rawResponse.status,
        data: content
    };
}




