import express from 'express';
import { ExpenseController } from '../controllers/expenseController';
import { ExpenseHandler } from '../handlers/expenseHandler';
import { UserController } from '../controllers/userController';
import { UserHandler } from '../handlers/userHandler';
import { CategoryHandler } from '../handlers/categoryHandler';
import { CategoryController } from '../controllers/categoryController';
import { sqliteService } from '../database/services/sqliteService';


const router = express.Router();

const dbService = new sqliteService();

const expenseController = new ExpenseController(dbService);
const expenseHandler = new ExpenseHandler(expenseController);
const userController = new UserController(dbService);
const userHandler = new UserHandler(userController);
const categoryController = new CategoryController(dbService);
const categoryHandler = new CategoryHandler(categoryController);

// User routes
router.post('/users', userHandler.createUser.bind(userHandler));
router.post('/login', userHandler.loginUser.bind(userHandler));

// Expense routes
router.post('/expenses', expenseHandler.createMovement.bind(expenseHandler));
router.get('/expenses/:id', expenseHandler.getMovementById.bind(expenseHandler));
router.delete('/expenses/:id', expenseHandler.deleteMovement.bind(expenseHandler));

// Category routes
router.post('/categories', categoryHandler.createCategory.bind(categoryHandler));
router.get('/categories/:id', categoryHandler.getCategoryById.bind(categoryHandler));
router.put('/categories/:id', categoryHandler.updateCategory.bind(categoryHandler));
router.delete('/categories/:id', categoryHandler.deleteCategory.bind(categoryHandler));

export default router;