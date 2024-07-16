import { APIRequestContext } from '@playwright/test'
import { Users } from './Users'

export class UserApiUtils {
  private apiContext: APIRequestContext

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext
  }

  async registerViaApi(userEmail: string, userPassword: string) {
    const registerResp = await this.apiContext.post('api/commerce/registerCustomer', {
      data: [
        {
          firstName: Users.randomUserFirstName,
          lastName: Users.randomUserLastName,
          email: userEmail,
          password: userPassword,
          terms: 'on',
        },
      ],
    })
    return registerResp
  }

  async loginViaAPI(userEmail: string, userPassword: string) {
    const loginResp = await this.apiContext.post('api/commerce/loginCustomer', {
      data: [
        {
          email: userEmail,
          password: userPassword,
        },
      ],
    })
    return loginResp
  }
}
