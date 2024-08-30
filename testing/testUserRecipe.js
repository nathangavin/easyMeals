import { getRequest, 
        postRequest, 
        patchRequest, 
        deleteRequest, 
        LOCALHOST, 
        handleCreate,
        handleGet,
        handleUpdate,
        handleDelete} from "./utils.js";

const userRecipeRoute = LOCALHOST + "userrecipes/";

export async function testCreateUserRecipe(userID, recipeID) {
    console.log('testing Create UserRecipe');
    const rating = Math.ceil(Math.random() * 10);
    return await postRequest(userRecipeRoute, {
        userID,
        recipeID,
        rating
    });
}

export async function testGetUserRecipe(id) {
    console.log('testing Get UserRecipe');
    return await getRequest(userRecipeRoute + id);
}

export async function testUpdateUserRecipe(id, session) {
    console.log('testing Update UserRecipe');
    return await patchRequest(userRecipeRoute + id, {
        rating: 5
    }, session);
}

export async function testDeleteUserRecipe(id, session) {
    console.log('testing Delete UserRecipe');
    return await deleteRequest(userRecipeRoute + id, session);
}

export function handleTestCreateUserRecipe(res) {
    handleCreate(res, 'userRecipe', "UserRecipe created successfully");
}

function isUserRecipe(u) {
    if (u &&
        u.ID &&
        u.createdTime &&
        u.modifiedTime &&
        u.userID &&
        u.recipeID &&
        u.rating) {
        return true;
    }
    return false;
}

export function handleTestGetUserRecipe(res) {
    handleGet(res, 'userRecipe', isUserRecipe);
}

export function handleTestUpdateUserRecipe(res) {
    handleUpdate(res, 'userRecipe');
}

export function handleTestDeleteUserRecipe(res) {
    handleDelete(res, 'userRecipe');
}
