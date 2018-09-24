import { create } from './create';

jest.mock('./db');

describe('create handler', () => {
  const { create: dbCreate } = require('./db');
  const response = {};
  const error = new Error('some error');

  const payload = {
    text: 'text',
  };
  const event = { body: JSON.stringify(payload) };
  const context: any = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call callback on response', async () => {
    dbCreate.mockReturnValue(Promise.resolve({ response, error: null }));

    const callback = jest.fn();

    await create(event, context, callback);

    expect(dbCreate).toHaveBeenCalledTimes(1);
    expect(dbCreate).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, response);
  });

  test('should call callback on error', async () => {
    dbCreate.mockReturnValue(Promise.resolve({ response, error }));

    const callback = jest.fn();

    await create(event, context, callback);

    expect(dbCreate).toHaveBeenCalledTimes(1);
    expect(dbCreate).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(error);
  });
});
