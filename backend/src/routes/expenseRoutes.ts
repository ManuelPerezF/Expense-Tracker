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

// ==================== USER ROUTES ====================
router.post('/users', userHandler.createUser.bind(userHandler));
router.post('/users/login', userHandler.loginUser.bind(userHandler));

// ==================== MOVEMENT ROUTES ====================
router.post('/movements', expenseHandler.createMovement.bind(expenseHandler));
router.get('/movements/:id', expenseHandler.getMovementById.bind(expenseHandler));
router.delete('/movements/:id', expenseHandler.deleteMovement.bind(expenseHandler));

// Rutas de movimientos por usuario
router.get('/users/:userId/movements', expenseHandler.getMovementsByUserId.bind(expenseHandler));

// ==================== FINANCIAL STATS ROUTES ====================
router.get('/users/:userId/summary', expenseHandler.getFinancialSummary.bind(expenseHandler));
// Nueva ruta para estadísticas por categoría
router.get('/users/:userId/category-stats', expenseHandler.getCategoryStats.bind(expenseHandler));

// ==================== CATEGORY ROUTES ====================
router.post('/categories', categoryHandler.createCategory.bind(categoryHandler));
router.get('/categories/:id', categoryHandler.getCategoryById.bind(categoryHandler));
router.put('/categories/:id', categoryHandler.updateCategory.bind(categoryHandler));
router.delete('/categories/:id', categoryHandler.deleteCategory.bind(categoryHandler));

// Rutas de categorías por usuario
router.get('/users/:userId/categories', categoryHandler.getCategoriesByUserId.bind(categoryHandler));
router.get('/users/:userId/categories/type', categoryHandler.getCategoriesByUserIdAndType.bind(categoryHandler));

export default router;