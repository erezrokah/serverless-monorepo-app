import { publicEndpoint } from './publicEndpointHandler';

describe('private endpoint handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call callback on event', () => {
    const event = {};
    const context: any = null;
    const callback = jest.fn();

    publicEndpoint(event, context, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, {
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
  });
});
