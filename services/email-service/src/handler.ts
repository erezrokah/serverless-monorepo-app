// tslint:disable-next-line:no-var-requires
const AWSXRay = require('aws-xray-sdk');
// tslint:disable-next-line:no-var-requires
AWSXRay.captureHTTPsGlobal(require('http'));

import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { sendMail } from './mailSender';

export const sendEmail: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback,
) => {
  return sendMail(event.body).then(({ response, error }) => {
    if (error) {
      callback && callback(error);
    } else {
      callback && callback(null, response);
    }
  });
};
