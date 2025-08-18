import { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { User } from '../database/interfaces/types';

export class UserHandler {
    userController: UserController;

    constructor(userController: UserController) {
        this.userController = userController;
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: "Username and password are required" });
                return;
            }

            const newUser = await this.userController.createUser({ username, password } as User);
            res.status(201).json({ message: "User created successfully", user: { username: newUser.username } });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;    
            
            if (!username || !password) {
                res.status(400).json({ error: "Username and password are required" });
                return;
            }

            const user = await this.userController.loginUser({ username, password } as User);
            if (!user) {
                res.status(401).json({ error: "Invalid username or password" });
                return;
            }
            res.status(200).json({ message: "Login successful", username});


        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
