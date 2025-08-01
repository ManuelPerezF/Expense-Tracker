
import { IDBService } from "../database/interfaces/dbService";
import { Category, CreateCategoryRequest } from '../database/interfaces/types';

export class CategoryController {
    dbService: IDBService;
    constructor(dbService: IDBService) {
        this.dbService = dbService;
    }

    async createCategory(category: CreateCategoryRequest): Promise<Category> {
        return this.dbService.createCategory(category);
    }

    async getCategoryById(id: number): Promise<Category | null> {
        return this.dbService.getCategoryById(id);
    }

    async updateCategory(id: number, category: Partial<Category>): Promise<Category | null> {
        return this.dbService.updateCategory(id, category);
    }

    async deleteCategory(id: number): Promise<boolean> {
        return this.dbService.deleteCategory(id);
    }
}
