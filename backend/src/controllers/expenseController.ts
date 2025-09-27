import { User, Category, Movement, CreateMovementRequest, CreateCategoryRequest, FinancialSummary, CategoryStats } from '../database/interfaces/types';
import { IDBService } from '../database/interfaces/dbService';

export class ExpenseController {
    dbService: IDBService;

    constructor(dbService: IDBService) {
        this.dbService = dbService;
    }

    async createMovement(movement: CreateMovementRequest): Promise<Movement> {
        return this.dbService.createMovement(movement);
    }
    async getMovementById(id: number): Promise<Movement | null> {
        return this.dbService.getMovementById(id);
    }
    async deleteMovement(id: number): Promise<boolean> {
        return this.dbService.deleteMovement(id);
    }

    async getMovementsByUserId(userId: number): Promise<Movement[]> {
        return this.dbService.getMovementsByUserId(userId);
    }

    async getFinancialSummary(userId: number): Promise<FinancialSummary> {
        return this.dbService.getFinancialSummary(userId);
    }

    async getCategoryStats(userId: number): Promise<CategoryStats[]> {
        return this.dbService.getCategoryStats(userId);
    }
}