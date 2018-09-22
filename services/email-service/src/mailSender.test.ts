import { from, html, subject, text } from './mailSender';

jest.mock('@sendgrid/mail');
jest.spyOn(console, 'log');

describe('mailSender', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('should initialize sendgrid with api key', () => {
    const apiKey = 'API_KEY';
    process.env.SENDGRID_API_KEY = apiKey;

    const sgMail = require('@sendgrid/mail');
    require('./mailSender');

    expect(sgMail.setApiKey).toHaveBeenCalledTimes(1);
    expect(sgMail.setApiKey).toHaveBeenCalledWith(apiKey);
  });

  test('should initialize sendgrid with empty key', () => {
    delete process.env.SENDGRID_API_KEY;

    const sgMail = require('@sendgrid/mail');
    require('./mailSender');

    expect(sgMail.setApiKey).toHaveBeenCalledTimes(1);
    expect(sgMail.setApiKey).toHaveBeenCalledWith('');
  });

  const badDataResponse = (input: any) => ({
    body: JSON.stringify({
      input,
      message: 'Bad input data or missing email address.',
    }),
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 422,
  });

  test('should return response on empty body', async () => {
    const sgMail = require('@sendgrid/mail');
    const { sendMail } = require('./mailSender');

    const body = '';

    const { response, error } = await sendMail(body);

    expect(sgMail.send).toHaveBeenCalledTimes(0);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
  });

  test('should return response on malformed body', async () => {
    const sgMail = require('@sendgrid/mail');
    const { sendMail } = require('./mailSender');

    const body = 'invalid json';

    const { response, error } = await sendMail(body);

    expect(sgMail.send).toHaveBeenCalledTimes(0);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      'Invalid body',
      expect.any(SyntaxError),
    );
  });

  test('should return response on empty to_address', async () => {
    const sgMail = require('@sendgrid/mail');
    const { sendMail } = require('./mailSender');

    const body = JSON.stringify({ to_address: '' });

    const { response, error } = await sendMail(body);

    expect(sgMail.send).toHaveBeenCalledTimes(0);
    expect(response).toEqual(badDataResponse(body));
    expect(error).toBeNull();
  });

  test('should return response on valid to_address', async () => {
    const sgMail = require('@sendgrid/mail');
    sgMail.send.mockReturnValue(Promise.resolve(['response', 'body']));

    const { sendMail } = require('./mailSender');

    const body = JSON.stringify({ to_address: 'some@email.com' });

    const { response, error } = await sendMail(body);

    expect(sgMail.send).toHaveBeenCalledTimes(1);

    expect(sgMail.send).toHaveBeenCalledWith({
      from,
      html,
      subject,
      text,
      to: 'some@email.com',
    });
    expect(response).toEqual({
      body: JSON.stringify({
        input: 'body',
        message: 'Request to send email is successful.',
      }),
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 202,
    });
    expect(error).toBeNull();
  });

  test('should return error on valid to_address', async () => {
    const sgMail = require('@sendgrid/mail');

    const err = new Error('failed to send message');
    sgMail.send.mockReturnValue(Promise.reject(err));

    const { sendMail } = require('./mailSender');

    const body = JSON.stringify({ to_address: 'some@email.com' });

    const { response, error } = await sendMail(body);

    expect(sgMail.send).toHaveBeenCalledTimes(1);
    expect(sgMail.send).toHaveBeenCalledWith({
      from,
      html,
      subject,
      text,
      to: 'some@email.com',
    });
    expect(response).toEqual({
      body: JSON.stringify({
        input: body,
        message: 'Unknown Error',
      }),
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 500,
    });
    expect(error).toBe(err);
  });
});
