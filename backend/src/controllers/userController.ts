import { IDBService } from "../database/interfaces/dbService";
import { User } from "../database/interfaces/types";

export class UserController {
    dbService: IDBService;
    constructor(dbService: IDBService) {
        this.dbService = dbService;
    }

    async createUser(user: User): Promise<User> {
        return await this.dbService.createUser(user);
    }

    async loginUser(user: User): Promise<User | null> {
        return await this.dbService.loginUser(user);
    }
    
}