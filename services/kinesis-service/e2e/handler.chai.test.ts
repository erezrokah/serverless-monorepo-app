import awsTesting from 'aws-testing-library/lib/chai';
import { invoke } from 'aws-testing-library/lib/utils/lambda';
import chai = require('chai');

chai.use(awsTesting);

const { expect } = chai;

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

    expect(data.message).to.be.equal('Record saved');
    await expect({ region, stream }).to.have.record(({ record }) => {
      return record.id === data.id && record.message === body.record.message;
    });
  });
});
