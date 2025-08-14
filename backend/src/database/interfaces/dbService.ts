import {
  User,
  Category,
  Movement,
  CreateMovementRequest,
  CreateCategoryRequest,
  FinancialSummary,
  CategoryStats,
} from "./types";


export interface IDBService {
  // User operations
  createUser(user: User): Promise<User>;
  loginUser(user: User): Promise<User | null>;


  // Category operations
  createCategory(category: CreateCategoryRequest): Promise<Category>;
  getCategoryById(id: number): Promise<Category | null>;
  updateCategory(
    id: number,
    category: Partial<Category>
  ): Promise<Category | null>;
  deleteCategory(id: number): Promise<boolean>;

  // Movement operations
  createMovement(movement: CreateMovementRequest): Promise<Movement>;
  getMovementById(id: number): Promise<Movement | null>;
  deleteMovement(id: number): Promise<boolean>;

  // Financial summaries
  getFinancialSummary(userId: number): Promise<FinancialSummary>;
  getCategoryStats(userId: number): Promise<CategoryStats[]>;
}
