import { invoke } from 'jest-e2e-serverless/lib/utils/lambda';

describe('kinesis service e2e tests', () => {
  const region = 'us-east-1';
  const stream = 'kinesis-service-stream-dev';

  test('should put record in stream on lambda invoke', async () => {
    const body = {
      record: { message: 'message from test' },
    };

    const result = await invoke(region, 'kinesis-service-dev-queue', {
      body: JSON.stringify(body),
    });

    const { data } = JSON.parse(result.body);

    expect.assertions(2);
    expect(data.message).toEqual('Record saved');
    await expect({ region, stream }).toHaveRecord(({ record }) => {
      return record.id === data.id && record.message === body.record.message;
    });
  });
});
