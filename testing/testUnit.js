import { 
    deleteRequest, 
    getRequest, 
    handleCreate, 
    handleGet, 
    handleUpdate, 
    handleDelete,
    LOCALHOST, 
    patchRequest, 
    postRequest } from "./utils.js";

const unitRoute = LOCALHOST + "units/";

export async function testCreateUnit(description) {
    console.log("testing Create Unit");
    return await postRequest(unitRoute, {
        desc: description
    });
}

export async function testGetUnit(id) {
    console.log("testing Get Unit");
    return await getRequest(unitRoute + id);
}

export async function testUpdateUnit(id) {
    console.log("testing Update Unit");
    return await patchRequest(unitRoute + id, {
        desc: 'updatedUnit'
    });
}

export async function testDeleteUnit(id) {
    console.log("testing Delete Unit");
    return await deleteRequest(unitRoute + id);
}

export function handleTestCreateUnit(res) {
    handleCreate(res, 'Unit', 'Unit created successfully');
}

function isUnit(u) {
    if (u &&
        u.ID &&
        u.createdTime &&
        u.modifiedTime &&
        u.description) {
        return true;
    }
    return false;
}

export function handleTestGetUnit(res) {
    handleGet(res, 'unit', isUnit);
}

export function handleTestUpdateUnit(res) {
    handleUpdate(res, 'Unit');
}

export function handleTestDeleteUnit(res) {
    handleDelete(res, 'Unit');
}

export async function unitCreateTest() {
    console.log("Starting Unit Create Test");
    const resCreateUnit = await testCreateUnit("testUnit");
    handleTestCreateUnit(resCreateUnit);
    const resGetUnit = await testGetUnit(resCreateUnit.data.id);
    handleTestGetUnit(resGetUnit);
    const resUpdateUnit = await testUpdateUnit(resCreateUnit.data.id);
    handleTestUpdateUnit(resUpdateUnit);
    const resDeleteUnit = await testDeleteUnit(resCreateUnit.data.id);
    handleTestDeleteUnit(resDeleteUnit);
    console.log("Ending Unit Create Test");
}
