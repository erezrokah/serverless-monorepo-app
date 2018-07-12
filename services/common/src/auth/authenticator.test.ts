const AUTH0_CLIENT_ID = 'AUTH0_CLIENT_ID';
const AUTH0_CLIENT_PUBLIC_KEY = 'AUTH0_CLIENT_PUBLIC_KEY';

process.env.AUTH0_CLIENT_ID = AUTH0_CLIENT_ID;
process.env.AUTH0_CLIENT_PUBLIC_KEY = AUTH0_CLIENT_PUBLIC_KEY;

import jwt = require('jsonwebtoken');
import * as authenticator from './authenticator';

jest.spyOn(console, 'log');
jest.mock('jsonwebtoken');

describe('authenticator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('generatePolicy', () => {
    test('should return policy on empty effect & resource', () => {
      const principalId = 'someId';
      expect(authenticator.generatePolicy(principalId, '', '')).toEqual({
        principalId,
      });
    });

    test('should return policy on non empty effect & resource', () => {
      const principalId = 'someId';
      const effect = 'someEffect';
      const resource = 'someResource';
      expect(
        authenticator.generatePolicy(principalId, effect, resource),
      ).toEqual({
        policyDocument: {
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: effect,
              Resource: resource,
            },
          ],
          Version: '2012-10-17',
        },
        principalId,
      });
    });
  });

  describe('decodeToken', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should return error on undefined authorizationToken', async () => {
      const { response, error } = await authenticator.decodeToken(
        undefined,
        'methodArn',
      );

      expect(response).toBeNull();
      expect(error).toEqual('Unauthorized');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('missing authorizationToken');
    });

    test('should return error on invalid authorizationToken', async () => {
      const { response, error } = await authenticator.decodeToken(
        'invalid token',
        'methodArn',
      );

      expect(response).toBeNull();
      expect(error).toEqual('Unauthorized');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        'invalid authorizationToken value',
      );
    });

    test('should return error on verify error', async () => {
      // @ts-ignore: Assignment to read only property
      authenticator.generatePolicy = jest.fn();

      const verify = jwt.verify as jest.Mock;
      const verifyError = new Error('Invalid Token');
      verify.mockImplementation((t, publicKey, options, callback) => {
        callback(verifyError, {});
      });

      const token = 'token';
      const { response, error } = await authenticator.decodeToken(
        `Bearer ${token}`,
        'methodArn',
      );

      expect(response).toBeNull();
      expect(error).toEqual('Unauthorized');
      expect(verify).toHaveBeenCalledTimes(1);
      expect(verify).toHaveBeenCalledWith(
        token,
        AUTH0_CLIENT_PUBLIC_KEY,
        { audience: AUTH0_CLIENT_ID },
        expect.any(Function),
      );
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('verifyError', verifyError);
      expect(authenticator.generatePolicy).toHaveBeenCalledTimes(0);
    });

    test('should return response on verify success', async () => {
      const generatePolicy = jest.fn();
      const policy = 'policy';
      generatePolicy.mockReturnValueOnce(policy);
      // @ts-ignore: Assignment to read only property
      authenticator.generatePolicy = generatePolicy;

      const verify = jwt.verify as jest.Mock;
      const decoded = { sub: 'sub' };
      verify.mockImplementation((t, publicKey, options, callback) => {
        callback(null, decoded);
      });

      const token = 'token';
      const methodArn = 'methodArn';
      const { response, error } = await authenticator.decodeToken(
        `Bearer ${token}`,
        methodArn,
      );

      expect(response).toBe(policy);
      expect(error).toBeNull();
      expect(verify).toHaveBeenCalledTimes(1);
      expect(verify).toHaveBeenCalledWith(
        token,
        AUTH0_CLIENT_PUBLIC_KEY,
        { audience: AUTH0_CLIENT_ID },
        expect.any(Function),
      );
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        'valid from customAuthorizer',
        decoded,
      );
      expect(authenticator.generatePolicy).toHaveBeenCalledTimes(1);
      expect(authenticator.generatePolicy).toHaveBeenCalledWith(
        decoded.sub,
        'Allow',
        methodArn,
      );
    });
  });
});
