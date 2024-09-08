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
import { testCreateUnit } from "./testUnit.js";
import { testCreateIngredient } from "./testIngredient.js";

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

export async function ingredientQuantityCreateTest() {
    console.log("Starting IngredientQuantity Create Test");
    const resCreateUnit = await testCreateUnit('testUnit');
    const resCreateIngredient = await testCreateIngredient('testIngredient', resCreateUnit.data.id);
    const resCreateIngredientQuantity = await testCreateIngredientQuantity(12, resCreateIngredient.data.id);
    handleTestCreateIngredientQuantity(resCreateIngredientQuantity);
    const resGetIngredientQuantity = await testGetIngredientQuantity(resCreateIngredientQuantity.data.id);
    handleTestGetIngredientQuantity(resGetIngredientQuantity);
    const resUpdateIngredientQuantity = await testUpdateIngredientQuantity(resCreateIngredientQuantity.data.id);
    handleTestUpdateIngredientQuantity(resUpdateIngredientQuantity);
    const resDeleteIngredientQuantity = await testDeleteIngredientQuantity(resCreateIngredientQuantity.data.id);
    handleTestDeleteIngredientQuantity(resDeleteIngredientQuantity);
    const resGetAllIngredientQuantity = await testGetAllIngredientQuantity();
    handleTestGetAllIngredientQuantity(resGetAllIngredientQuantity);
    console.log("Ending IngredientQuantity Create Test");
}
