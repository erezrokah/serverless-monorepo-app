import AWS = require('aws-sdk');
import { clearAllFiles } from 'jest-e2e-serverless/lib/utils/s3';
import fetch from 'node-fetch';

describe('file service e2e tests', () => {
  const region = 'us-east-1';
  const bucket = 'file-service-s3-bucket-dev';

  beforeEach(async () => {
    await clearAllFiles(region, bucket);
  });

  afterEach(async () => {
    await clearAllFiles(region, bucket);
  });

  test('should create db entry on lambda invoke', async () => {
    const lambda = new AWS.Lambda({ region });

    const body = {
      file_url:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/240px-Google_2015_logo.svg.png',
      key: '240px-Google_2015_logo.svg.png',
    };

    const params = {
      FunctionName: 'file-service-dev-save',
      Payload: JSON.stringify({
        body: JSON.stringify(body),
      }),
    };

    const { Payload } = await lambda.invoke(params).promise();
    const result = JSON.parse(JSON.parse(Payload.toString()).body);
    expect(result.message).toEqual('File saved');

    const expectedBuffer = await (await fetch(body.file_url)).buffer();

    expect({ region, bucket }).toHaveObject(body.key, expectedBuffer);
  });
});
