import { UserDb } from '@data/typeorm/entities/user/UserDb';
import { USER_SCHEMA } from '@data/typeorm/schemas/user/UserSchema';
import { User } from '@domain/entities/user/User';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { Service } from 'typedi';
import { BaseRepository } from '../base/BaseRepository';

@Service('user.repository')
export class UserRepository extends BaseRepository<string, User, UserDb> implements IUserRepository {
    constructor() {
        super(UserDb, USER_SCHEMA);
    }

    async getByEmail(email: string): Promise<User | null> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result ? result.toEntity() : null;
    }

    async checkEmailExist(email: string): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .select(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.ID}`)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }
}
