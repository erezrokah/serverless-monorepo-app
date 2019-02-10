import axios from 'axios';
import { config } from './config';
import { deleteUserByEmail } from './utils/auth0';
import { auth0Login } from './utils/puppeteer';

describe('private api e2e', () => {
  const url = `${config.api}/private`;
  const method = 'POST';

  describe('unauthorized tests', () => {
    test('should return 401 response', async () => {
      expect.assertions(1);
      await expect({ url, method }).toReturnResponse({
        data: {
          message: 'Unauthorized',
        },
        statusCode: 401,
      });
    });
  });

  describe('authorized tests', () => {
    const {
      domain,
      clientId,
      email,
      password,
      redirectUri,
      managementClientId,
      managementClientSecret,
    } = config;

    let authorization = '';

    beforeEach(async () => {
      // delete existing test user
      await deleteUserByEmail(
        email,
        domain,
        managementClientId,
        managementClientSecret,
      );

      // login and get token
      authorization = await auth0Login(
        domain,
        clientId,
        email,
        password,
        redirectUri,
      );
    });

    afterEach(async () => {
      // delete existing test user
      await deleteUserByEmail(
        email,
        domain,
        managementClientId,
        managementClientSecret,
      );
    });

    test('should return 200 response on authorized request', async () => {
      expect.assertions(1);

      await expect({
        headers: { Authorization: authorization },
        method,
        url,
      }).toReturnResponse({
        data: {
          message:
            'Hi ⊂◉‿◉つ from Private API. Only logged in users can see this',
        },
        statusCode: 200,
      });
    });
  });
});
