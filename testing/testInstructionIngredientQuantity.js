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
    handleUpdate405,
    handleGetAll} from "./utils.js";
import { testCreateUnit, testDeleteUnit } from "./testUnit.js";
import { testCreateIngredient, testDeleteIngredient } from "./testIngredient.js";
import { testCreateInstruction, testDeleteInstruction } from "./testInstruction.js";
import { testCreateIngredientQuantity, testDeleteIngredientQuantity } from "./testIngredientQuantity.js";

// =============== Utils =========================

const instructionIngredientQuantityRoute = LOCALHOST + "instructionIngredientQuantities/";

function isInstructionIngredientQuantity(p) {
    if (p &&
        p.ID &&
        p.createdTime &&
        p.modifiedTime &&
        p.quantityID && 
        p.instructionID) {
        return true;
    }
    return false;
}

// =============== Test functions =======================

export async function testCreateInstructionIngredientQuantity(quantityID, instructionID) {
    return await postRequest(instructionIngredientQuantityRoute, {
        quantityID,
        instructionID
    });
}

export async function testGetInstructionIngredientQuantity(id) {
    return await getRequest(instructionIngredientQuantityRoute + id);
}

export async function testGetAllInstructionIngredientQuantity() {
    return await getRequest(instructionIngredientQuantityRoute);
}

export async function testUpdateInstructionIngredientQuantity(id) {
    return await patchRequest(instructionIngredientQuantityRoute + id, {
        quantityID: 11
    });
}

export async function testDeleteInstructionIngredientQuantity(id) {
    return await deleteRequest(instructionIngredientQuantityRoute + id);
}

async function setupForGetAll(id1, id2) {
    const res1 = await testCreateInstructionIngredientQuantity(id1, id2);
    const res2 = await testCreateInstructionIngredientQuantity(id1, id2);
    const res3 = await testCreateInstructionIngredientQuantity(id1, id2);
    const res4 = await testCreateInstructionIngredientQuantity(id1, id2);
    const res5 = await testCreateInstructionIngredientQuantity(id1, id2);
    
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
        await testDeleteInstructionIngredientQuantity(id);
    }
}

// ============== Handle Functions ==========================

export function handleTestCreateInstructionIngredientQuantity(res) {
    console.log("testing Create InstructionIngredientQuantity");
    handleCreate(res, 'InstructionIngredientQuantity', 'InstructionIngredientQuantity created successfully');
}

export function handleTestGetInstructionIngredientQuantity(res) {
    console.log("testing Get InstructionIngredientQuantity");
    handleGet(res, 'instructionIngredientQuantity', isInstructionIngredientQuantity);
}

export function handleTestGetAllInstructionIngredientQuantity(res) {
    console.log("testing Get All InstructionIngredientQuantity");
    handleGetAll(res, 'instructionIngredientQuantities', isInstructionIngredientQuantity);
}

export function handleTestUpdateInstructionIngredientQuantity(res) {
    console.log("testing Update InstructionIngredientQuantity");
    handleUpdate405(res, 'InstructionIngredientQuantity');
}

export function handleTestDeleteInstructionIngredientQuantity(res) {
    console.log("testing Delete InstructionIngredientQuantity");
    handleDelete(res, 'InstructionIngredientQuantity');
}

// ============ Summary Function ========================

async function setupTestConditions() {
    const resCreateUnit = await testCreateUnit('testUnit');
    const resCreateIngredient = await testCreateIngredient('testIngredient', resCreateUnit.data.id);
    const resCreateInstruction = await testCreateInstruction('testInstruction');
    const resCreateIngredientQuantity = await testCreateIngredientQuantity(12, resCreateIngredient.data.id);
    
    return {
        unitID: resCreateUnit.data.id,
        ingredientID: resCreateIngredient.data.id,
        instructionID: resCreateInstruction.data.id,
        ingredientQuantityID: resCreateIngredientQuantity.data.id
    };
}

async function cleanUpTestConditions(setup) {
    await testDeleteIngredientQuantity(setup.ingredientQuantityID);
    await testDeleteInstruction(setup.instructionID);
    await testDeleteIngredient(setup.ingredientID);
    await testDeleteUnit(setup.unitID);
}

export async function instructionIngredientQuantityCreateTest() {
    console.log("Starting InstructionIngredientQuantity Create Test");
    const setup = await setupTestConditions();
    const resCreateInstructionIngredientQuantity = await testCreateInstructionIngredientQuantity(
                                        setup.ingredientQuantityID,
                                        setup.instructionID);
    handleTestCreateInstructionIngredientQuantity(resCreateInstructionIngredientQuantity);
    const resGetInstructionIngredientQuantity = 
                        await testGetInstructionIngredientQuantity(
                                    resCreateInstructionIngredientQuantity.data.id);
    handleTestGetInstructionIngredientQuantity(resGetInstructionIngredientQuantity);
    const resUpdateInstructionIngredientQuantity = 
                        await testUpdateInstructionIngredientQuantity(
                                    resCreateInstructionIngredientQuantity.data.id);
    handleTestUpdateInstructionIngredientQuantity(resUpdateInstructionIngredientQuantity);
    const resDeleteInstructionIngredientQuantity = 
                        await testDeleteInstructionIngredientQuantity(
                                    resCreateInstructionIngredientQuantity.data.id);
    handleTestDeleteInstructionIngredientQuantity(resDeleteInstructionIngredientQuantity);

    const getAllIds = await setupForGetAll(setup.ingredientQuantityID, setup.instructionID);
    const resGetAllInstructionIngredientQuantity = 
                        await testGetAllInstructionIngredientQuantity();
    handleTestGetAllInstructionIngredientQuantity(resGetAllInstructionIngredientQuantity);
    await deleteForGetAll(getAllIds);
    
    await cleanUpTestConditions(setup);

    console.log("Ending InstructionIngredientQuantity Create Test");
}
