import { postRequest, getRequest, LOCALHOST } from "./utils.js";
export async function testTest() {
    let res = await postRequest(LOCALHOST + 'tests/', {
        desc: "test"
    });
    let res2 = await getRequest(LOCALHOST + 'tests/' + res.data.id);

    console.log(res);
    console.log(res2);

}
