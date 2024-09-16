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

// ============ Utils =====================

const unitRoute = LOCALHOST + "units/";

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

// =============== Test functions =================

export async function testCreateUnit(description) {
    return await postRequest(unitRoute, {
        desc: description
    });
}

export async function testGetUnit(id) {
    return await getRequest(unitRoute + id);
}

export async function testGetAllUnits() {
    return await getRequest(unitRoute);
}

export async function testUpdateUnit(id) {
    return await patchRequest(unitRoute + id, {
        desc: 'updatedUnit'
    });
}

export async function testDeleteUnit(id) {
    return await deleteRequest(unitRoute + id);
}

async function setupForGetAll() {
    const res1 = await testCreateUnit("testUnitAll");
    const res2 = await testCreateUnit("testUnitAll");
    const res3 = await testCreateUnit("testUnitAll");
    const res4 = await testCreateUnit("testUnitAll");
    const res5 = await testCreateUnit("testUnitAll");

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
        await testDeleteUnit(id);
    }
}

// ========== Handle Functions ==============

export function handleTestCreateUnit(res) {
    console.log("testing Create Unit");
    handleCreate(res, 'Unit', 'Unit created successfully');
}

export function handleTestGetUnit(res) {
    console.log("testing Get Unit");
    handleGet(res, 'unit', isUnit);
}

export function handleTestGetAllUnits(res) {
    console.log("testing Get All Units");
    handleGetAll(res, 'units', isUnit);
}

export function handleTestUpdateUnit(res) {
    console.log("testing Update Unit");
    handleUpdate(res, 'Unit');
}

export function handleTestDeleteUnit(res) {
    console.log("testing Delete Unit");
    handleDelete(res, 'Unit');
}

// =========== Summary function ================

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
    const getAllIds = await setupForGetAll();
    const resGetAllUnits = await testGetAllUnits();
    handleTestGetAllUnits(resGetAllUnits);
    await deleteForGetAll(getAllIds);
    console.log("Ending Unit Create Test");
}
