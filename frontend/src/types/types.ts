export interface User {
    id: number;
    username: string;
    password: string;
    created_at?: Date;
}

export interface Category {
    id: number;
    name: string;
    emoji: string;
    user_id: number;
    created_at?: Date;
}

export interface Movement {
    id: number;
    amount: number;
    type: 'gasto' | 'entrada';
    category_id: number;
    user_id: number;
    date: string; // ISO date string
    created_at?: Date;

}

export interface CreateMovementRequest {
    amount: number;
    type: 'gasto' | 'entrada';
    category_id: number;
    user_id: number;
    date: string; // ISO date string
}

export interface CreateCategoryRequest {
    name: string;
    emoji: string;
    user_id: number;
    created_at?: Date;
}

export interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    totalMovements: number;
}

export interface CategoryStats {
    id: number;
    name: string;
    emoji: string;
    totalMovements: number;
    totalIncome: number;
    totalExpenses: number;
    balance: number;
}

