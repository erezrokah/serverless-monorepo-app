describe('public api e2e', () => {
  const { config } = require('./config');
  const url = `${config.api}/public`;
  const method = 'POST';

  test('should return 200OK response', async () => {
    expect.assertions(1);
    await expect({ url, method }).toReturnResponse({
      data: {
        message: 'Hi ⊂◉‿◉つ from Public API',
      },
      statusCode: 200,
    });
  });
});
