import { Callback, Context, CustomAuthorizerEvent, Handler } from 'aws-lambda';
import { decodeToken } from '../../common/src/auth/authenticator';

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
export const auth: Handler = (
  event: CustomAuthorizerEvent,
  context: Context,
  callback: Callback,
) => {
  console.log(event);
  return decodeToken(event.authorizationToken, event.methodArn).then(
    ({ response, error }) => {
      if (error) {
        callback && callback(error);
      } else {
        callback && callback(null, response);
      }
    },
  );
};
