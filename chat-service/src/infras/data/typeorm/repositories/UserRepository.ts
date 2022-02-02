import { User } from 'domain/entities/User';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Repository } from '../common/Repository';
import { UserDb } from '../entities/UserDb';
import { USER_SCHEMA } from '../schemas/UserSchema';

@Service(InjectRepository.User)
export class UserRepository extends Repository<User, UserDb> implements IUserRepository {
    constructor() {
        super(UserDb, USER_SCHEMA);
    }

    async getByEmail(email: string): Promise<User | undefined> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result && result.toEntity();
    }

    async checkEmailExist(email: string): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .select(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.ID}`)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }
}
