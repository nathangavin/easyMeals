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

const instructionRoute = LOCALHOST + "instructions/";

export async function testCreateInstruction(description) {
    console.log("testing Create Instruction");
    return await postRequest(instructionRoute, {
        description
    });
}

export async function testGetInstruction(id) {
    console.log("testing Get Instruction");
    return await getRequest(instructionRoute + id);
}

export async function testGetAllInstruction() {
    console.log("testing Get All Instruction");
    return await getRequest(instructionRoute);
}

export async function testUpdateInstruction(id) {
    console.log("testing Update Instruction");
    return await patchRequest(instructionRoute + id, {
        description: 'updatedInstruction'
    });
}

export async function testDeleteInstruction(id) {
    console.log("testing Delete Instruction");
    return await deleteRequest(instructionRoute + id);
}

export function handleTestCreateInstruction(res) {
    handleCreate(res, 'Instruction', 'Instruction created successfully');
}

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

export function handleTestGetInstruction(res) {
    handleGet(res, 'instruction', isInstruction);
}

export function handleTestGetAllInstruction(res) {
    handleGetAll(res, 'instructions', isInstruction);
}

export function handleTestUpdateInstruction(res) {
    handleUpdate(res, 'Instruction');
}

export function handleTestDeleteInstruction(res) {
    handleDelete(res, 'Instruction');
}

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
