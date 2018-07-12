import { auth } from './authHandler';

jest.mock('../../common/src/auth/authenticator');

describe('auth handler', () => {
  const { decodeToken } = require('../../common/src/auth/authenticator');
  const response = {};
  const error = new Error('some error');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call callback on response', async () => {
    decodeToken.mockReturnValue(Promise.resolve({ response, error: null }));

    const event = {
      authorizationToken: 'authorizationToken',
      methodArn: 'methodArn',
    };
    const context: any = null;
    const callback = jest.fn();

    await auth(event, context, callback);

    expect(decodeToken).toHaveBeenCalledTimes(1);
    expect(decodeToken).toHaveBeenCalledWith(
      event.authorizationToken,
      event.methodArn,
    );
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, response);
  });

  test('should call callback on error', async () => {
    decodeToken.mockReturnValue(Promise.resolve({ response, error }));

    const event = {
      authorizationToken: 'authorizationToken',
      methodArn: 'methodArn',
    };
    const context: any = null;
    const callback = jest.fn();

    await auth(event, context, callback);

    expect(decodeToken).toHaveBeenCalledTimes(1);
    expect(decodeToken).toHaveBeenCalledWith(
      event.authorizationToken,
      event.methodArn,
    );
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(error);
  });
});
