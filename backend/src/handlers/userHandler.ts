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
            console.log('Creating user with data:', { username, password: password ? '[REDACTED]' : 'undefined' });

            if (!username || !password) {
                res.status(400).json({ error: "Username and password are required" });
                return;
            }

            const newUser = await this.userController.createUser({ username, password } as User);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;    
            console.log('Login attempt for user:', username);
            
            if (!username || !password) {
                res.status(400).json({ error: "Username and password are required" });
                return;
            }

            const user = await this.userController.loginUser({ username, password } as User);
            if (!user) {
                res.status(401).json({ error: "Invalid username or password" });
                return;
            }
            res.status(200).json(user);

        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
