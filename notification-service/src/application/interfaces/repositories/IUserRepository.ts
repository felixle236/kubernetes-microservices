import { User } from 'domain/entities/User';
import { SelectFilterListQuery } from 'shared/database/DbTypes';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface IUserRepository extends IRepository<User> {
    findAllUserDevices(filter: { roleId?: string } & SelectFilterListQuery<User>): Promise<User[]>;

    getByEmail(email: string): Promise<User | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
}
