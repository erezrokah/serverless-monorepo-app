import AWS = require('aws-sdk');
import fetch from 'node-fetch';

const region = 'us-east-1';
AWS.config.update({ region });

const Bucket = 'file-service-s3-bucket-dev';

// tslint:disable-next-line:ban-types
const listAllKeys = async token => {
  const opts = { Bucket, ContinuationToken: null };
  if (token) {
    opts.ContinuationToken = token;
  }
  const s3 = new AWS.S3();
  const data = await s3.listObjectsV2(opts).promise();
  let allKeys = data.Contents || [];
  if (data.IsTruncated) {
    allKeys = allKeys.concat(await listAllKeys(data.NextContinuationToken));
  }
  return allKeys;
};

const clearAllFiles = async () => {
  const allKeys = await listAllKeys(null);
  if (allKeys.length > 0) {
    const s3 = new AWS.S3();
    await s3
      .deleteObjects({
        Bucket,
        Delete: {
          Objects: allKeys.map(item => ({ Key: item.Key })),
          Quiet: false,
        },
      })
      .promise();
  }
};

describe('file service e2e tests', () => {
  beforeEach(async () => {
    await clearAllFiles();
  });

  afterEach(async () => {
    await clearAllFiles();
  });

  test('should create db entry on lambda invoke', async () => {
    const lambda = new AWS.Lambda();

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

    const s3 = new AWS.S3();
    const actualBuffer = (await s3
      .getObject({ Bucket, Key: body.key })
      .promise()).Body;

    expect(actualBuffer).toEqual(expectedBuffer);
  });
});
