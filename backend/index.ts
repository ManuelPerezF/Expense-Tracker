import express from 'express';
import cors from 'cors';
import { initializeDatabase, closeDatabase } from './src/database/models/sqlite';
import expenseRoutes from './src/routes/expenseRoutes';

const app = express();
const PORT =  3000;

app.use(cors());
app.use(express.json());
app.use('/api', expenseRoutes)

async function startServer(){
    try {
        await initializeDatabase();
        console.log('Database initialized successfully');
        app.listen(PORT, () => console.log(`RUNNING ON https://localhost:${PORT}`));
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

startServer();

