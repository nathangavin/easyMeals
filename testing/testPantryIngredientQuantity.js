import { 
    deleteRequest, 
    getRequest, 
    handleCreate, 
    handleGet, 
    handleDelete,
    LOCALHOST, 
    patchRequest, 
    postRequest, 
    handleUpdate405} from "./utils.js";
import { testCreateUnit } from "./testUnit.js";
import { testCreateIngredient } from "./testIngredient.js";
import { testCreatePantry } from "./testPantry.js";
import { testCreateIngredientQuantity } from "./testIngredientQuantity.js";

const pantryIngredientQuantityRoute = LOCALHOST + "pantryIngredientQuantities/";

export async function testCreatePantryIngredientQuantity(quantityID, pantryID) {
    console.log("testing Create PantryIngredientQuantity");
    return await postRequest(pantryIngredientQuantityRoute, {
        quantityID,
        pantryID
    });
}

export async function testGetPantryIngredientQuantity(id) {
    console.log("testing Get PantryIngredientQuantity");
    return await getRequest(pantryIngredientQuantityRoute + id);
}

export async function testUpdatePantryIngredientQuantity(id) {
    console.log("testing Update PantryIngredientQuantity");
    return await patchRequest(pantryIngredientQuantityRoute + id, {
        quantityID: 11
    });
}

export async function testDeletePantryIngredientQuantity(id) {
    console.log("testing Delete PantryIngredientQuantity");
    return await deleteRequest(pantryIngredientQuantityRoute + id);
}

export function handleTestCreatePantryIngredientQuantity(res) {
    handleCreate(res, 'PantryIngredientQuantity', 'PantryIngredientQuantity created successfully');
}

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

export function handleTestGetPantryIngredientQuantity(res) {
    handleGet(res, 'pantryIngredientQuantity', isPantryIngredientQuantity);
}

export function handleTestUpdatePantryIngredientQuantity(res) {
    handleUpdate405(res, 'PantryIngredientQuantity');
}

export function handleTestDeletePantryIngredientQuantity(res) {
    handleDelete(res, 'PantryIngredientQuantity');
}

export async function pantryIngredientQuantityCreateTest() {
    console.log("Starting PantryIngredientQuantity Create Test");
    const resCreateUnit = await testCreateUnit('testUnit');
    const resCreateIngredient = await testCreateIngredient('testIngredient', resCreateUnit.data.id);
    const resCreatePantry = await testCreatePantry('testPantry');
    const resCreateIngredientQuantity = await testCreateIngredientQuantity(12, resCreateIngredient.data.id);
    const resCreatePantryIngredientQuantity = await testCreatePantryIngredientQuantity(
                                        resCreateIngredientQuantity.data.id, 
                                        resCreatePantry.data.id);
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
    console.log("Ending PantryIngredientQuantity Create Test");
}
