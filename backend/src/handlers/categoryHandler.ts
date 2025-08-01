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
      const { name, emoji, user_id } = req.body;
      if (!name || !emoji || !user_id) {
        res
          .status(400)
          .json({ error: "Name, emoji, and user_id are required" });
        return;
      }
      const newCategory = await this.categoryController.createCategory({
        name,
        emoji,
        user_id,
      } as Category);
      res
        .status(201)
        .json({
          message: "Category created successfully",
          category: newCategory,
        });
    } catch (error) {}
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

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, emoji } = req.body;
      if (!name && !emoji) {
        res.status(400).json({ error: "At least one field is required" });
        return;
      }
      const updatedCategory = await this.categoryController.updateCategory(
        Number(id),
        { name, emoji }
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
