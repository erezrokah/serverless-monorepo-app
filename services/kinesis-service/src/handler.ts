import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { queueEvent } from './kinesis';

export const queue: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback,
) => {
  return queueEvent(event.body).then(({ response, error }) => {
    if (error) {
      callback && callback(error);
    } else {
      callback && callback(null, response);
    }
  });
};
