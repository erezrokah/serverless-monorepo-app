import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { saveFile } from './fileSaver';

export const save: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback,
) => {
  return saveFile(event.body).then(({ response, error }) => {
    if (error) {
      callback && callback(error);
    } else {
      callback && callback(null, response);
    }
  });
};
