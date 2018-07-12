import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
export const privateEndpoint: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  callback(null, {
    body: JSON.stringify({
      message: 'Hi ⊂◉‿◉つ from Private API. Only logged in users can see this',
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
