import { sendEmail } from './handler';

jest.mock('./mailSender');

describe('handler', () => {
  const { sendMail } = require('./mailSender');
  const response = {};
  const error = new Error('some error');

  const payload = { to_address: 'to@email.com' };
  const event = { body: JSON.stringify(payload) };
  const context: any = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call callback on response', async () => {
    sendMail.mockReturnValue(Promise.resolve({ response, error: null }));

    const callback = jest.fn();

    await sendEmail(event, context, callback);

    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, response);
  });

  test('should call callback on error', async () => {
    sendMail.mockReturnValue(Promise.resolve({ response, error }));

    const callback = jest.fn();

    await sendEmail(event, context, callback);

    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(error);
  });
});
