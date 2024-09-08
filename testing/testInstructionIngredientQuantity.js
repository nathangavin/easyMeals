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
import { testCreateUnit } from "./testUnit.js";
import { testCreateIngredient } from "./testIngredient.js";
import { testCreateInstruction } from "./testInstruction.js";
import { testCreateIngredientQuantity } from "./testIngredientQuantity.js";

const instructionIngredientQuantityRoute = LOCALHOST + "instructionIngredientQuantities/";

export async function testCreateInstructionIngredientQuantity(quantityID, instructionID) {
    console.log("testing Create InstructionIngredientQuantity");
    return await postRequest(instructionIngredientQuantityRoute, {
        quantityID,
        instructionID
    });
}

export async function testGetInstructionIngredientQuantity(id) {
    console.log("testing Get InstructionIngredientQuantity");
    return await getRequest(instructionIngredientQuantityRoute + id);
}

export async function testGetAllInstructionIngredientQuantity() {
    console.log("testing Get All InstructionIngredientQuantity");
    return await getRequest(instructionIngredientQuantityRoute);
}

export async function testUpdateInstructionIngredientQuantity(id) {
    console.log("testing Update InstructionIngredientQuantity");
    return await patchRequest(instructionIngredientQuantityRoute + id, {
        quantityID: 11
    });
}

export async function testDeleteInstructionIngredientQuantity(id) {
    console.log("testing Delete InstructionIngredientQuantity");
    return await deleteRequest(instructionIngredientQuantityRoute + id);
}

export function handleTestCreateInstructionIngredientQuantity(res) {
    handleCreate(res, 'InstructionIngredientQuantity', 'InstructionIngredientQuantity created successfully');
}

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

export function handleTestGetInstructionIngredientQuantity(res) {
    handleGet(res, 'instructionIngredientQuantity', isInstructionIngredientQuantity);
}

export function handleTestGetAllInstructionIngredientQuantity(res) {
    handleGetAll(res, 'instructionIngredientQuantities', isInstructionIngredientQuantity);
}

export function handleTestUpdateInstructionIngredientQuantity(res) {
    handleUpdate405(res, 'InstructionIngredientQuantity');
}

export function handleTestDeleteInstructionIngredientQuantity(res) {
    handleDelete(res, 'InstructionIngredientQuantity');
}

export async function instructionIngredientQuantityCreateTest() {
    console.log("Starting InstructionIngredientQuantity Create Test");
    const resCreateUnit = await testCreateUnit('testUnit');
    const resCreateIngredient = await testCreateIngredient('testIngredient', resCreateUnit.data.id);
    const resCreateInstruction = await testCreateInstruction('testInstruction');
    const resCreateIngredientQuantity = await testCreateIngredientQuantity(12, resCreateIngredient.data.id);
    const resCreateInstructionIngredientQuantity = await testCreateInstructionIngredientQuantity(
                                        resCreateIngredientQuantity.data.id, 
                                        resCreateInstruction.data.id);
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

    const resCreateInstructionIngredientQuantity1 = await testCreateInstructionIngredientQuantity(
                                        resCreateIngredientQuantity.data.id, 
                                        resCreateInstruction.data.id);
    const resCreateInstructionIngredientQuantity2 = await testCreateInstructionIngredientQuantity(
                                        resCreateIngredientQuantity.data.id, 
                                        resCreateInstruction.data.id);
    const resCreateInstructionIngredientQuantity3 = await testCreateInstructionIngredientQuantity(
                                        resCreateIngredientQuantity.data.id, 
                                        resCreateInstruction.data.id);
    const resCreateInstructionIngredientQuantity4 = await testCreateInstructionIngredientQuantity(
                                        resCreateIngredientQuantity.data.id, 
                                        resCreateInstruction.data.id);
    const resCreateInstructionIngredientQuantity5 = await testCreateInstructionIngredientQuantity(
                                        resCreateIngredientQuantity.data.id, 
                                        resCreateInstruction.data.id);

    const resGetAllInstructionIngredientQuantity = 
                        await testGetAllInstructionIngredientQuantity();
    handleTestGetAllInstructionIngredientQuantity(resGetAllInstructionIngredientQuantity);

    await testDeleteInstructionIngredientQuantity(resCreateInstructionIngredientQuantity1.data.id);
    await testDeleteInstructionIngredientQuantity(resCreateInstructionIngredientQuantity2.data.id);
    await testDeleteInstructionIngredientQuantity(resCreateInstructionIngredientQuantity3.data.id);
    await testDeleteInstructionIngredientQuantity(resCreateInstructionIngredientQuantity4.data.id);
    await testDeleteInstructionIngredientQuantity(resCreateInstructionIngredientQuantity5.data.id);

    console.log("Ending InstructionIngredientQuantity Create Test");
}
