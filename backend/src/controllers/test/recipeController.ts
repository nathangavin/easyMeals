import Joi from "joi";

import RecipeDbInterface, {Recipe, RecipeDbNames} from "../../models/test/recipeModel";
import { Controller } from "../common/controller";

const recipeController : Controller<Recipe> = new Controller<Recipe>(
    Joi.object({
        name: Joi.string().alphanum().min(1).max(20).required()
    }),
    Joi.object({
        name: Joi.string().alphanum().min(1).max(20),
        draftFlag: Joi.boolean()
    }),
    new RecipeDbInterface(),
    Recipe,
    'recipeId',
    ['name'],
    RecipeDbNames
);

export default recipeController;
