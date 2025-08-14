import {
  User,
  Category,
  Movement,
  CreateMovementRequest,
  CreateCategoryRequest,
  FinancialSummary,
  CategoryStats,
} from "../interfaces/types";
import { getDatabase } from "../models/sqlite";
import { IDBService } from "../interfaces/dbService";


export class sqliteService implements IDBService {
  
    async createUser(user: User): Promise<User> {
        const db = await getDatabase();
        const result = await db.run(
            `INSERT INTO users (username, password) VALUES (?, ?)`,
            [user.username, user.password]
        );
        const newUser = await db.get(
            `SELECT * FROM users WHERE id = ?`,
            [result.lastID]
        );
        return newUser as User;
    }

    async loginUser(user: User): Promise<User | null> {
        const db = await getDatabase();
        const existingUser = await db.get(
            `SELECT * FROM users WHERE username = ? AND password = ?`,
            [user.username, user.password]
        );
        return existingUser as User | null;
    }

    async createCategory(category: CreateCategoryRequest): Promise<Category> {
        const db = await getDatabase();
        const result = await db.run(
            `INSERT INTO categories (name, emoji, user_id) VALUES (?, ?, ?)`,
            [category.name, category.emoji, category.user_id]
        );
        const newCategory = await db.get(
            `SELECT * FROM categories WHERE id = ?`,
            [result.lastID]
        );
        return newCategory as Category;
    }

    async getCategoryById(id: number): Promise<Category | null> {
        const db = await getDatabase();
        const category = await db.get(`SELECT * FROM categories WHERE id = ?`, [id]);
        return category as Category | null;
    }

    async updateCategory(id: number, category: Partial<Category>): Promise<Category | null> {
        const db = await getDatabase();
        const fields = Object.keys(category).map(key => `${key} = ?`).join(', ');
        const values = Object.values(category);
        values.push(id);
        
        const result = await db.run(
            `UPDATE categories SET ${fields} WHERE id = ?`,
            values
        );
        
        if (result.changes === 0) return null;
        
        const updatedCategory = await db.get(`SELECT * FROM categories WHERE id = ?`, [id]);
        return updatedCategory as Category;
        
    }

    async deleteCategory(id: number): Promise<boolean> {
        const db = await getDatabase();
        const result = await db.run(`DELETE FROM categories WHERE id = ?`, [id]);
        return result.changes! > 0;
    }

    async createMovement(movement: CreateMovementRequest): Promise<Movement> {
        const db = await getDatabase();
        const result = await db.run(
            `INSERT INTO movements (amount, type, category_id, user_id, date) VALUES (?, ?, ?, ?, ?)`,
            [movement.amount, movement.type, movement.category_id, movement.user_id, movement.date]
        );
        const newMovement = await db.get(
            `SELECT * FROM movements WHERE id = ?`,
            [result.lastID]
        );
        return newMovement as Movement;
    }

    async getMovementById(id: number): Promise<Movement | null> {
        const db = await getDatabase();
        const movement = await db.get(`SELECT * FROM movements WHERE id = ?`, [id]);
        return movement as Movement | null;
    }

    async deleteMovement(id: number): Promise<boolean> {
        const db = await getDatabase();
        const result = await db.run(`DELETE FROM movements WHERE id = ?`, [id]);
        return result.changes! > 0;
    }

    async getFinancialSummary(userId: number): Promise<FinancialSummary> {
        const db = await getDatabase();
        const summary = await db.get(
            `SELECT 
                SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END) AS totalIncome,
                SUM(CASE WHEN type = 'gasto' THEN amount ELSE 0 END) AS totalExpenses,
                COUNT(*) AS totalMovements
            FROM movements WHERE user_id = ?`, 
            [userId]
        );

        return {
            totalIncome: summary.totalIncome || 0,
            totalExpenses: summary.totalExpenses || 0,
            balance: (summary.totalIncome || 0) - (summary.totalExpenses || 0),
            totalMovements: summary.totalMovements || 0
        }; 
    }

    async getCategoryStats(userId: number): Promise<CategoryStats[]> {
        const db = await getDatabase();
        const stats = await db.all(
            `SELECT 
                c.id, c.name, c.emoji,
                COUNT(m.id) AS totalMovements,
                SUM(CASE WHEN m.type = 'entrada' THEN m.amount ELSE 0 END) AS totalIncome,
                SUM(CASE WHEN m.type = 'gasto' THEN m.amount ELSE 0 END) AS totalExpenses
            FROM categories c
            LEFT JOIN movements m ON c.id = m.category_id AND m.user_id = ?
            WHERE c.user_id = ?
            GROUP BY c.id`, 
            [userId, userId]
        );

        return stats.map(stat => ({
            id: stat.id,
            name: stat.name,
            emoji: stat.emoji,
            totalMovements: stat.totalMovements || 0,
            totalIncome: stat.totalIncome || 0,
            totalExpenses: stat.totalExpenses || 0,
            balance: (stat.totalIncome || 0) - (stat.totalExpenses || 0)
        }));
    }

}   