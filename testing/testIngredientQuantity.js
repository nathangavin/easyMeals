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
import { testCreateIngredient, testDeleteIngredient } from "./testIngredient.js";
import { testDeleteUserRecipe } from "./testUserRecipe.js";

// ============== Utils ======================

const ingredientQuantityRoute = LOCALHOST + "ingredientQuantities/";

function isIngredientQuantity(p) {
    if (p &&
        p.ID &&
        p.createdTime &&
        p.modifiedTime &&
        p.quantity && 
        p.ingredientID) {
        return true;
    }
    return false;
}

// ============== test functions ==================

export async function testCreateIngredientQuantity(quantity, ingredientID) {
    return await postRequest(ingredientQuantityRoute, {
        quantity,
        ingredientID
    });
}

export async function testGetIngredientQuantity(id) {
    return await getRequest(ingredientQuantityRoute + id);
}

export async function testGetAllIngredientQuantity() {
    return await getRequest(ingredientQuantityRoute);
}

export async function testUpdateIngredientQuantity(id) {
    return await patchRequest(ingredientQuantityRoute + id, {
        quantity: 11
    });
}

export async function testDeleteIngredientQuantity(id) {
    return await deleteRequest(ingredientQuantityRoute + id);
}

async function setupForGetAll(ingredientID) {
    const res1 = await testCreateIngredientQuantity(12, ingredientID);
    const res2 = await testCreateIngredientQuantity(12, ingredientID);
    const res3 = await testCreateIngredientQuantity(12, ingredientID);
    const res4 = await testCreateIngredientQuantity(12, ingredientID);
    const res5 = await testCreateIngredientQuantity(12, ingredientID);

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
        await testDeleteIngredientQuantity(id);
    }
}

// ============== handle functions ==================

export function handleTestCreateIngredientQuantity(res) {
    console.log("testing Create IngredientQuantity");
    handleCreate(res, 'IngredientQuantity', 'IngredientQuantity created successfully');
}

export function handleTestGetIngredientQuantity(res) {
    console.log("testing Get IngredientQuantity");
    handleGet(res, 'ingredientQuantity', isIngredientQuantity);
}

export function handleTestGetAllIngredientQuantity(res) {
    console.log("testing Get All IngredientQuantity");
    handleGetAll(res, 'ingredientQuantities', isIngredientQuantity);
}

export function handleTestUpdateIngredientQuantity(res) {
    console.log("testing Update IngredientQuantity");
    handleUpdate(res, 'IngredientQuantity');
}

export function handleTestDeleteIngredientQuantity(res) {
    console.log("testing Delete IngredientQuantity");
    handleDelete(res, 'IngredientQuantity');
}

// =============== summary function ==================

async function setupTestConditions() {
    const resCreateUnit = await testCreateUnit('testUnit');
    const resCreateIngredient = await testCreateIngredient('testIngredient', resCreateUnit.data.id);
    return {
        unitID: resCreateUnit.data.id,
        ingredientID: resCreateIngredient.data.id
    };
}

async function cleanUpTestConditions(setup) {
    await testDeleteIngredient(setup.ingredientID);
    await testDeleteUnit(setup.unitID);
}

export async function ingredientQuantityCreateTest() {
    console.log("Starting IngredientQuantity Create Test");
    const setup = await setupTestConditions();
    const resCreateIngredientQuantity = await testCreateIngredientQuantity(12, setup.ingredientID);
    handleTestCreateIngredientQuantity(resCreateIngredientQuantity);
    const resGetIngredientQuantity = await testGetIngredientQuantity(resCreateIngredientQuantity.data.id);
    handleTestGetIngredientQuantity(resGetIngredientQuantity);
    const resUpdateIngredientQuantity = await testUpdateIngredientQuantity(resCreateIngredientQuantity.data.id);
    handleTestUpdateIngredientQuantity(resUpdateIngredientQuantity);
    const resDeleteIngredientQuantity = await testDeleteIngredientQuantity(resCreateIngredientQuantity.data.id);
    handleTestDeleteIngredientQuantity(resDeleteIngredientQuantity);
    const getAllIds = await setupForGetAll(setup.ingredientID);
    const resGetAllIngredientQuantity = await testGetAllIngredientQuantity();
    handleTestGetAllIngredientQuantity(resGetAllIngredientQuantity);
    await deleteForGetAll(getAllIds);
    await cleanUpTestConditions(setup);
    console.log("Ending IngredientQuantity Create Test");
}
