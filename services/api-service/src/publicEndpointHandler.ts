import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
export const publicEndpoint: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  callback(null, {
    body: JSON.stringify({
      message: 'Hi ⊂◉‿◉つ from Public API',
    }),
    headers: {
      /* Required for cookies, authorization headers with HTTPS */
      'Access-Control-Allow-Credentials': true,
      /* Required for CORS support to work */
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
  });
};
