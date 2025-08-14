import express from 'express';
import cors from 'cors';
import { initializeDatabase, closeDatabase } from './src/database/models/sqlite';
import expenseRoutes from './src/routes/expenseRoutes';

const app = express();
const PORT =  3000;

app.use(cors());
app.use(express.json());


app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

app.use('/api', expenseRoutes)


async function startServer(){
    try {
        await initializeDatabase();
        console.log('Database initialized successfully');
        app.listen(PORT, () => console.log(`RUNNING ON http://localhost:${PORT}`));
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

startServer();

