describe('private api e2e', () => {
  const { config } = require('./config');
  const url = `${config.api}/private`;
  const method = 'POST';

  test('should return 401 response', async () => {
    expect.assertions(1);
    await expect({ url, method }).toReturnResponse({
      data: {
        message: 'Unauthorized',
      },
      statusCode: 401,
    });
  });
});
