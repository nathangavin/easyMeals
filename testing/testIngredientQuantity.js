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
import { testCreateUnit } from "./testUnit.js";
import { testCreateIngredient } from "./testIngredient.js";

const ingredientQuantityRoute = LOCALHOST + "ingredientQuantities/";

export async function testCreateIngredientQuantity(quantity, ingredientID) {
    console.log("testing Create IngredientQuantity");
    return await postRequest(ingredientQuantityRoute, {
        quantity,
        ingredientID
    });
}

export async function testGetIngredientQuantity(id) {
    console.log("testing Get IngredientQuantity");
    return await getRequest(ingredientQuantityRoute + id);
}

export async function testUpdateIngredientQuantity(id) {
    console.log("testing Update IngredientQuantity");
    return await patchRequest(ingredientQuantityRoute + id, {
        quantity: 11
    });
}

export async function testDeleteIngredientQuantity(id) {
    console.log("testing Delete IngredientQuantity");
    return await deleteRequest(ingredientQuantityRoute + id);
}

export function handleTestCreateIngredientQuantity(res) {
    handleCreate(res, 'IngredientQuantity', 'IngredientQuantity created successfully');
}

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

export function handleTestGetIngredientQuantity(res) {
    handleGet(res, 'ingredientQuantity', isIngredientQuantity);
}

export function handleTestUpdateIngredientQuantity(res) {
    handleUpdate(res, 'IngredientQuantity');
}

export function handleTestDeleteIngredientQuantity(res) {
    handleDelete(res, 'IngredientQuantity');
}

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
    console.log("Ending IngredientQuantity Create Test");
}
