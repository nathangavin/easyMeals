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

const ingredientRoute = LOCALHOST + "ingredients/";

export async function testCreateIngredient(name, unitID) {
    console.log("testing Create Ingredient");
    return await postRequest(ingredientRoute, {
        name,
        unitID
    });
}

export async function testGetIngredient(id) {
    console.log("testing Get Ingredient");
    return await getRequest(ingredientRoute + id);
}

export async function testGetAllIngredients() {
    console.log("testing Get All Ingredients");
    return await getRequest(ingredientRoute);
}

export async function testUpdateIngredient(id) {
    console.log("testing Update Ingredient");
    return await patchRequest(ingredientRoute + id, {
        name: 'updatedIngredient'
    });
}

export async function testDeleteIngredient(id) {
    console.log("testing Delete Ingredient");
    return await deleteRequest(ingredientRoute + id);
}

export function handleTestCreateIngredient(res) {
    handleCreate(res, 'Ingredient', 'Ingredient created successfully');
}

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

export function handleTestGetIngredient(res) {
    handleGet(res, 'ingredient', isIngredient);
}

export function handleTestGetAllIngredients(res) {
    handleGetAll(res, 'ingredients', isIngredient);
}

export function handleTestUpdateIngredient(res) {
    handleUpdate(res, 'Ingredient');
}

export function handleTestDeleteIngredient(res) {
    handleDelete(res, 'Ingredient');
}

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
