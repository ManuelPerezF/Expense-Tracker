import { CategoryController } from "../controllers/categoryController";
import { Request, Response } from "express";
import { Category } from "../database/interfaces/types";

export class CategoryHandler {
  categoryController: CategoryController;
  constructor(categoryController: CategoryController) {
    this.categoryController = categoryController;
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, emoji, type, user_id } = req.body;
      if (!name || !emoji || !type || !user_id) {
        res
          .status(400)
          .json({ error: "Name, emoji, type, and user_id are required" });
        return;
      }
      
      if (type !== 'income' && type !== 'expense') {
        res.status(400).json({ error: "Type must be either 'income' or 'expense'" });
        return;
      }

      // Validar que el nombre no esté vacío después de trim
      if (!name.trim()) {
        res.status(400).json({ error: "Category name cannot be empty" });
        return;
      }
      
      const newCategory = await this.categoryController.createCategory({
        name: name.trim(),
        emoji,
        type,
        user_id,
      });
      res
        .status(201)
        .json({
          message: "Category created successfully",
          category: newCategory,
        });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.categoryController.getCategoryById(Number(id));
      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCategoriesByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const categories = await this.categoryController.getCategoriesByUserId(Number(userId));
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCategoriesByUserIdAndType(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { type } = req.query;
      
      if (!type || (type !== 'income' && type !== 'expense')) {
        res.status(400).json({ error: "Valid type parameter (income or expense) is required" });
        return;
      }
      
      const categories = await this.categoryController.getCategoriesByUserIdAndType(Number(userId), type as 'income' | 'expense');
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, emoji, type } = req.body;
      if (!name && !emoji && !type) {
        res.status(400).json({ error: "At least one field is required" });
        return;
      }
      
      if (type && type !== 'income' && type !== 'expense') {
        res.status(400).json({ error: "Type must be either 'income' or 'expense'" });
        return;
      }

      // Validar que el nombre no esté vacío si se proporciona
      if (name !== undefined && !name.trim()) {
        res.status(400).json({ error: "Category name cannot be empty" });
        return;
      }
      
      const updateData: Partial<Category> = {};
      if (name) updateData.name = name.trim();
      if (emoji) updateData.emoji = emoji;
      if (type) updateData.type = type;
      
      const updatedCategory = await this.categoryController.updateCategory(
        Number(id),
        updateData
      );
      if (!updatedCategory) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.status(200).json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.categoryController.deleteCategory(Number(id));
      if (!success) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
