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

// ================ Utils ==================

const instructionRoute = LOCALHOST + "instructions/";

function isInstruction(p) {
    if (p &&
        p.ID &&
        p.createdTime &&
        p.modifiedTime &&
        p.description) {
        return true;
    }
    return false;
}

// =============== Test functions ==================

export async function testCreateInstruction(description) {
    return await postRequest(instructionRoute, {
        description
    });
}

export async function testGetInstruction(id) {
    return await getRequest(instructionRoute + id);
}

export async function testGetAllInstruction() {
    return await getRequest(instructionRoute);
}

export async function testUpdateInstruction(id) {
    return await patchRequest(instructionRoute + id, {
        description: 'updatedInstruction'
    });
}

export async function testDeleteInstruction(id) {
    return await deleteRequest(instructionRoute + id);
}

// ============ Handle Functions ==================

export function handleTestCreateInstruction(res) {
    console.log("testing Create Instruction");
    handleCreate(res, 'Instruction', 'Instruction created successfully');
}

export function handleTestGetInstruction(res) {
    console.log("testing Get Instruction");
    handleGet(res, 'instruction', isInstruction);
}

export function handleTestGetAllInstruction(res) {
    console.log("testing Get All Instruction");
    handleGetAll(res, 'instructions', isInstruction);
}

export function handleTestUpdateInstruction(res) {
    console.log("testing Update Instruction");
    handleUpdate(res, 'Instruction');
}

export function handleTestDeleteInstruction(res) {
    console.log("testing Delete Instruction");
    handleDelete(res, 'Instruction');
}

// ============= Summary Function ==============

export async function instructionCreateTest() {
    console.log("Starting Instruction Create Test");
    const resCreateInstruction = await testCreateInstruction("testInstruction");
    handleTestCreateInstruction(resCreateInstruction);
    const resGetInstruction = await testGetInstruction(resCreateInstruction.data.id);
    handleTestGetInstruction(resGetInstruction);
    const resUpdateInstruction = await testUpdateInstruction(resCreateInstruction.data.id);
    handleTestUpdateInstruction(resUpdateInstruction);
    const resDeleteInstruction = await testDeleteInstruction(resCreateInstruction.data.id);
    handleTestDeleteInstruction(resDeleteInstruction);
    const resGetAllInstructions = await testGetAllInstruction();
    handleTestGetAllInstruction(resGetAllInstructions);
    console.log("Ending Instruction Create Test");
}
