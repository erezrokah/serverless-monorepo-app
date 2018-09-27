import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { create as dbCreate } from './db';

export const create: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback,
) => {
  return dbCreate(event.body).then(({ response, error }) => {
    if (error) {
      callback && callback(error);
    } else {
      callback && callback(null, response);
    }
  });
};
