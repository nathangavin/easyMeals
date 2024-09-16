import { 
    deleteRequest, 
    getRequest, 
    handleCreate, 
    handleGet, 
    handleDelete,
    LOCALHOST, 
    patchRequest, 
    postRequest, 
    handleUpdate405,
    handleGetAll} from "./utils.js";
import { testCreateUnit, testDeleteUnit } from "./testUnit.js";
import { testCreateIngredient, testDeleteIngredient } from "./testIngredient.js";
import { testCreatePantry, testDeletePantry } from "./testPantry.js";
import { testCreateIngredientQuantity, testDeleteIngredientQuantity } from "./testIngredientQuantity.js";

// =================== Utils ========================

const pantryIngredientQuantityRoute = LOCALHOST + "pantryIngredientQuantities/";

function isPantryIngredientQuantity(p) {
    if (p &&
        p.ID &&
        p.createdTime &&
        p.modifiedTime &&
        p.quantityID && 
        p.pantryID) {
        return true;
    }
    return false;
}

// ================= Test Functions ===================

export async function testCreatePantryIngredientQuantity(quantityID, pantryID) {
    return await postRequest(pantryIngredientQuantityRoute, {
        quantityID,
        pantryID
    });
}

export async function testGetPantryIngredientQuantity(id) {
    return await getRequest(pantryIngredientQuantityRoute + id);
}

export async function testGetAllPantryIngredientQuantity() {
    return await getRequest(pantryIngredientQuantityRoute);
}

export async function testUpdatePantryIngredientQuantity(id) {
    return await patchRequest(pantryIngredientQuantityRoute + id, {
        quantityID: 11
    });
}

export async function testDeletePantryIngredientQuantity(id) {
    return await deleteRequest(pantryIngredientQuantityRoute + id);
}

async function setupForGetAll(id1, id2) {
    const res1 = await testCreatePantryIngredientQuantity(id1, id2);
    const res2 = await testCreatePantryIngredientQuantity(id1, id2);
    const res3 = await testCreatePantryIngredientQuantity(id1, id2);
    const res4 = await testCreatePantryIngredientQuantity(id1, id2);
    const res5 = await testCreatePantryIngredientQuantity(id1, id2);
    
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
        await testDeletePantryIngredientQuantity(id);
    }
}
 
// ============== handle functions ========================

export function handleTestCreatePantryIngredientQuantity(res) {
    console.log("testing Create PantryIngredientQuantity");
    handleCreate(res, 'PantryIngredientQuantity', 'PantryIngredientQuantity created successfully');
}


export function handleTestGetPantryIngredientQuantity(res) {
    console.log("testing Get PantryIngredientQuantity");
    handleGet(res, 'pantryIngredientQuantity', isPantryIngredientQuantity);
}

export function handleTestGetAllPantryIngredientQuantity(res) {
    console.log("testing Get All PantryIngredientQuantity");
    handleGetAll(res, 'pantryIngredientQuantities', isPantryIngredientQuantity);
}

export function handleTestUpdatePantryIngredientQuantity(res) {
    console.log("testing Update PantryIngredientQuantity");
    handleUpdate405(res, 'PantryIngredientQuantity');
}

export function handleTestDeletePantryIngredientQuantity(res) {
    console.log("testing Delete PantryIngredientQuantity");
    handleDelete(res, 'PantryIngredientQuantity');
}

// ============== summary function =======================

async function setupTestConditions() {
    const resCreateUnit = await testCreateUnit('testUnit');
    const resCreateIngredient = await testCreateIngredient('testIngredient', resCreateUnit.data.id);
    const resCreatePantry = await testCreatePantry('testPantry');
    const resCreateIngredientQuantity = await testCreateIngredientQuantity(12, resCreateIngredient.data.id);
    
    return {
        unitID: resCreateUnit.data.id,
        ingredientID: resCreateIngredient.data.id,
        pantryID: resCreatePantry.data.id,
        ingredientQuantityID: resCreateIngredientQuantity.data.id
    };
}

async function cleanUpTestConditions(setup) {
    await testDeleteIngredientQuantity(setup.ingredientQuantityID);
    await testDeletePantry(setup.pantryID);
    await testDeleteIngredient(setup.ingredientID);
    await testDeleteUnit(setup.unitID);
}

export async function pantryIngredientQuantityCreateTest() {
    console.log("Starting PantryIngredientQuantity Create Test");
    const setup = await setupTestConditions();
    const resCreatePantryIngredientQuantity = await testCreatePantryIngredientQuantity(
                                        setup.ingredientQuantityID,
                                        setup.pantryID);
    handleTestCreatePantryIngredientQuantity(resCreatePantryIngredientQuantity);
    const resGetPantryIngredientQuantity = 
                        await testGetPantryIngredientQuantity(
                                    resCreatePantryIngredientQuantity.data.id);
    handleTestGetPantryIngredientQuantity(resGetPantryIngredientQuantity);
    const resUpdatePantryIngredientQuantity = 
                        await testUpdatePantryIngredientQuantity(
                                    resCreatePantryIngredientQuantity.data.id);
    handleTestUpdatePantryIngredientQuantity(resUpdatePantryIngredientQuantity);
    const resDeletePantryIngredientQuantity = 
                        await testDeletePantryIngredientQuantity(
                                    resCreatePantryIngredientQuantity.data.id);
    handleTestDeletePantryIngredientQuantity(resDeletePantryIngredientQuantity);

    const getAllIds = await setupForGetAll(setup.ingredientQuantityID, setup.pantryID);

    const resGetAllPantryIngredientQuantity =
                        await testGetAllPantryIngredientQuantity();
    handleTestGetAllPantryIngredientQuantity(resGetAllPantryIngredientQuantity);

    await deleteForGetAll(getAllIds);
    
    await cleanUpTestConditions(setup);

    console.log("Ending PantryIngredientQuantity Create Test");
}
