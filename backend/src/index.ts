import express from 'express';
import helmet from "helmet";
import morgan from "morgan";

import unitRoutes from './routes/unitRoutes';
import pantryRoutes from './routes/pantryRoutes';
import userRoutes from './routes/userRoutes';
import sessionRoutes from './routes/sessionRoutes';
import recipeRoutes from './routes/recipeRoutes';
import userRecipeRoutes from './routes/userRecipeRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import instructionRoutes from './routes/instructionRoutes';
import ingredientQuantityRoutes from './routes/ingredientQuantityRoutes';
import instructionIngredientQuantityRoutes from './routes/instructionIngredientQuantityRoutes';
import userPantryRoutes from './routes/userPantryRoutes';
import pantryIngredientQuantityRoutes from './routes/pantryIngredientQuantityRoutes';
import healthRoutes from './routes/healthRoutes';
import testRoutes from './routes/testRoute';

console.log(process.argv[2] == "--test");

// create express server
const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/units', unitRoutes);
app.use('/api/pantries', pantryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/userrecipes', userRecipeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/instructions', instructionRoutes);
app.use('/api/ingredientQuantities', ingredientQuantityRoutes);
app.use('/api/instructionIngredientQuantities', instructionIngredientQuantityRoutes);
app.use('/api/userpantries', userPantryRoutes);
app.use('/api/pantryIngredientQuantities', pantryIngredientQuantityRoutes);
app.use('/health', healthRoutes);
app.use('/api/tests', testRoutes);

const PORT = process.env.BACKEND_PORT ? 
                parseInt(process.env.BACKEND_PORT) ?? 3000 
                : 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});





