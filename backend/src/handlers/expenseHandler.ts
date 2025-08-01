import { Request, Response } from 'express';
import { Movement } from '../database/interfaces/types';
import { ExpenseController } from '../controllers/expenseController';


export class ExpenseHandler {
    expenseController: ExpenseController;
    constructor(expenseController: ExpenseController) {
        this.expenseController = expenseController;
    }

    async createMovement(req: Request, res: Response): Promise<void> {
        try {
            const { amount, type, category_id, user_id, date } = req.body;
            if (!amount || !type || !category_id || !user_id || !date) {
                res.status(400).json({ error: "All fields are required" });
                return;
            }
            const newMovement = await this.expenseController.createMovement({
                amount,
                type,
                category_id,
                user_id,
                date
            } as Movement);
            res.status(201).json({
                message: "Movement created successfully",
                movement: newMovement
            });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getMovementById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const movement = await this.expenseController.getMovementById(Number(id));
            if (!movement) {
                res.status(404).json({ error: "Movement not found" });
                return;
            }
            res.status(200).json(movement);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async deleteMovement(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const success = await this.expenseController.deleteMovement(Number(id));
            if (!success) {
                res.status(404).json({ error: "Movement not found" });
                return;
            }
            res.status(200).json({ message: "Movement deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}