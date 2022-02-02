import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/accounts')
export class UserController {
    @Get('/api-internal')
    testApiInternal(): Promise<{data: boolean}> {
        return Promise.resolve({ data: true });
    }
}
