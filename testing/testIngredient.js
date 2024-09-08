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

export async function ingredientCreateTest() {
    console.log("Starting Ingredient Create Test");
    const resCreateUnit = await testCreateUnit('testUnit');
    const resCreateIngredient = await testCreateIngredient("testIngredient", resCreateUnit.data.id);
    handleTestCreateIngredient(resCreateIngredient);
    const resGetIngredient = await testGetIngredient(resCreateIngredient.data.id);
    handleTestGetIngredient(resGetIngredient);
    const resUpdateIngredient = await testUpdateIngredient(resCreateIngredient.data.id);
    handleTestUpdateIngredient(resUpdateIngredient);
    const resDeleteIngredient = await testDeleteIngredient(resCreateIngredient.data.id);
    handleTestDeleteIngredient(resDeleteIngredient);
    const resGetAllIngredients = await testGetAllIngredients();
    handleTestGetAllIngredients(resGetAllIngredients);
    console.log("Ending Ingredient Create Test");
}
