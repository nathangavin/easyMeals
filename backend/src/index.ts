import express from 'express';
import helmet from "helmet";
import morgan from "morgan";

import unitRoutes from './routes/unitRoutes';

// create express server
const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/units', unitRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
