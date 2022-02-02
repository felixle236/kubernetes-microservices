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
}
