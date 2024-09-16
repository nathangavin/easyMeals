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
import { testCreateUnit, testDeleteUnit } from "./testUnit.js";

// ========== Utils ============================

const ingredientRoute = LOCALHOST + "ingredients/";

function isIngredient(p) {
    if (p &&
        p.ID &&
        p.createdTime &&
        p.modifiedTime &&
        p.name &&
        p.unitID) {
        return true;
    }
    return false;
}

// ========== test functions ====================

export async function testCreateIngredient(name, unitID) {
    return await postRequest(ingredientRoute, {
        name,
        unitID
    });
}

export async function testGetIngredient(id) {
    return await getRequest(ingredientRoute + id);
}

export async function testGetAllIngredients() {
    return await getRequest(ingredientRoute);
}

export async function testUpdateIngredient(id) {
    return await patchRequest(ingredientRoute + id, {
        name: 'updatedIngredient'
    });
}

export async function testDeleteIngredient(id) {
    return await deleteRequest(ingredientRoute + id);
}

async function setupForGetAll(unitID) {
    const res1 = await testCreateIngredient('testAllIngredient', unitID);
    const res2 = await testCreateIngredient('testAllIngredient', unitID);
    const res3 = await testCreateIngredient('testAllIngredient', unitID);
    const res4 = await testCreateIngredient('testAllIngredient', unitID);
    const res5 = await testCreateIngredient('testAllIngredient', unitID);

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
        await testDeleteIngredient(id);
    }
}

// ========== handle functions ====================

export function handleTestCreateIngredient(res) {
    console.log("testing Create Ingredient");
    handleCreate(res, 'Ingredient', 'Ingredient created successfully');
}


export function handleTestGetIngredient(res) {
    console.log("testing Get Ingredient");
    handleGet(res, 'ingredient', isIngredient);
}

export function handleTestGetAllIngredients(res) {
    console.log("testing Get All Ingredients");
    handleGetAll(res, 'ingredients', isIngredient);
}

export function handleTestUpdateIngredient(res) {
    console.log("testing Update Ingredient");
    handleUpdate(res, 'Ingredient');
}

export function handleTestDeleteIngredient(res) {
    console.log("testing Delete Ingredient");
    handleDelete(res, 'Ingredient');
}

// =============== Summary function =================

async function setupTestConditions() {
    const resCreateUnit = await testCreateUnit('testUnit');
    return {unitId: resCreateUnit.data.id};
}

async function cleanUpTestConditions(setup) {
    await testDeleteUnit(setup.unitId);
}

export async function ingredientCreateTest() {
    console.log("Starting Ingredient Create Test");
    const setup = await setupTestConditions();
    const resCreateIngredient = await testCreateIngredient("testIngredient", setup.unitId);
    handleTestCreateIngredient(resCreateIngredient);
    const resGetIngredient = await testGetIngredient(resCreateIngredient.data.id);
    handleTestGetIngredient(resGetIngredient);
    const resUpdateIngredient = await testUpdateIngredient(resCreateIngredient.data.id);
    handleTestUpdateIngredient(resUpdateIngredient);
    const resDeleteIngredient = await testDeleteIngredient(resCreateIngredient.data.id);
    handleTestDeleteIngredient(resDeleteIngredient);
    const getAllIds = await setupForGetAll(setup.unitId);
    const resGetAllIngredients = await testGetAllIngredients();
    handleTestGetAllIngredients(resGetAllIngredients);
    await deleteForGetAll(getAllIds);
    await cleanUpTestConditions(setup);
    console.log("Ending Ingredient Create Test");
}
