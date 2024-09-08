import { 
    deleteRequest, 
    getRequest, 
    handleCreate, 
    handleGet, 
    handleUpdate, 
    handleDelete,
    LOCALHOST, 
    patchRequest, 
    postRequest, 
    handleGetAll} from "./utils.js";

const pantryRoute = LOCALHOST + "pantries/";

export async function testCreatePantry(name) {
    console.log("testing Create Pantry");
    return await postRequest(pantryRoute, {
        name
    });
}

export async function testGetPantry(id) {
    console.log("testing Get Pantry");
    return await getRequest(pantryRoute + id);
}

export async function testGetAllPantry() {
    console.log("testing Get All Pantry");
    return await getRequest(pantryRoute);
}

export async function testUpdatePantry(id) {
    console.log("testing Update Pantry");
    return await patchRequest(pantryRoute + id, {
        name: 'updatedPantry'
    });
}

export async function testDeletePantry(id) {
    console.log("testing Delete Pantry");
    return await deleteRequest(pantryRoute + id);
}

export function handleTestCreatePantry(res) {
    handleCreate(res, 'Pantry', 'Pantry created successfully');
}

function isPantry(p) {
    if (p &&
        p.ID &&
        p.createdTime &&
        p.modifiedTime &&
        p.name) {
        return true;
    }
    return false;
}

export function handleTestGetPantry(res) {
    handleGet(res, 'pantry', isPantry);
}

export function handleTestGetAllPantry(res) {
    handleGetAll(res, 'pantries', isPantry);
}

export function handleTestUpdatePantry(res) {
    handleUpdate(res, 'Pantry');
}

export function handleTestDeletePantry(res) {
    handleDelete(res, 'Pantry');
}

export async function pantryCreateTest() {
    console.log("Starting Pantry Create Test");
    const resCreatePantry = await testCreatePantry("testPantry");
    handleTestCreatePantry(resCreatePantry);
    const resGetPantry = await testGetPantry(resCreatePantry.data.id);
    handleTestGetPantry(resGetPantry);
    const resUpdatePantry = await testUpdatePantry(resCreatePantry.data.id);
    handleTestUpdatePantry(resUpdatePantry);
    const resDeletePantry = await testDeletePantry(resCreatePantry.data.id);
    handleTestDeletePantry(resDeletePantry);

    const resCreatePantry1 = await testCreatePantry("testPantry");
    const resCreatePantry2 = await testCreatePantry("testPantry");
    const resCreatePantry3 = await testCreatePantry("testPantry");
    const resCreatePantry4 = await testCreatePantry("testPantry");
    const resCreatePantry5 = await testCreatePantry("testPantry");

    const resGetAllPantry = await testGetAllPantry();
    handleTestGetAllPantry(resGetAllPantry);
    
    await testDeletePantry(resCreatePantry1.data.id);
    await testDeletePantry(resCreatePantry2.data.id);
    await testDeletePantry(resCreatePantry3.data.id);
    await testDeletePantry(resCreatePantry4.data.id);
    await testDeletePantry(resCreatePantry5.data.id);

    console.log("Ending Pantry Create Test");
}
