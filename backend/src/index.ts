import express from 'express';
import helmet from "helmet";
import morgan from "morgan";

import unitRoutes from './routes/unitRoutes';
import pantryRoutes from './routes/pantryRoutes';
import userRoutes from './routes/userRoutes';
import sessionRoutes from './routes/sessionRoutes';

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
