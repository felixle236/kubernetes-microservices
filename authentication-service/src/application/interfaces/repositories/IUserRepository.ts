import { User } from 'domain/entities/User';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface IUserRepository extends IRepository<User> {
    getByEmail(email: string): Promise<User | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
}
