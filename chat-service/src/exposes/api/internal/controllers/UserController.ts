import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/users')
export class UserController {
    @Get('/api-internal')
    testApiInternal(): Promise<{data: boolean}> {
        return Promise.resolve({ data: true });
    }
}
