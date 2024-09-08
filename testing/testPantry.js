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

// =============== Utils =====================

const pantryRoute = LOCALHOST + "pantries/";

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

// =============== Test functions ====================

export async function testCreatePantry(name) {
    return await postRequest(pantryRoute, {
        name
    });
}

export async function testGetPantry(id) {
    return await getRequest(pantryRoute + id);
}

export async function testGetAllPantry() {
    return await getRequest(pantryRoute);
}

export async function testUpdatePantry(id) {
    return await patchRequest(pantryRoute + id, {
        name: 'updatedPantry'
    });
}

export async function testDeletePantry(id) {
    return await deleteRequest(pantryRoute + id);
}

async function setupForGetAll(val) {
    const res1 = await testCreatePantry(val);
    const res2 = await testCreatePantry(val);
    const res3 = await testCreatePantry(val);
    const res4 = await testCreatePantry(val);
    const res5 = await testCreatePantry(val);
    
    return [
        res1.data.id,
        res2.data.id,
        res3.data.id,
        res4.data.id,
        res5.data.id,
    ];
}

async function deleteForGetAll(ids) {
    for (const id of ids) {
        await testDeletePantry(id);
    }
}

// ================= handle functions ====================

export function handleTestCreatePantry(res) {
    console.log("testing Create Pantry");
    handleCreate(res, 'Pantry', 'Pantry created successfully');
}

export function handleTestGetPantry(res) {
    console.log("testing Get Pantry");
    handleGet(res, 'pantry', isPantry);
}

export function handleTestGetAllPantry(res) {
    console.log("testing Get All Pantry");
    handleGetAll(res, 'pantries', isPantry);
}

export function handleTestUpdatePantry(res) {
    console.log("testing Update Pantry");
    handleUpdate(res, 'Pantry');
}

export function handleTestDeletePantry(res) {
    console.log("testing Delete Pantry");
    handleDelete(res, 'Pantry');
}

// =============== Summary Function ===================

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

    const getAllIds = await setupForGetAll("testPantry");

    const resGetAllPantry = await testGetAllPantry();
    handleTestGetAllPantry(resGetAllPantry);
    
    await deleteForGetAll(getAllIds);

    console.log("Ending Pantry Create Test");
}
