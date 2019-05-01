import awsTesting from 'aws-testing-library/lib/chai';
import { invoke } from 'aws-testing-library/lib/utils/lambda';
import { clearAllObjects } from 'aws-testing-library/lib/utils/s3';
import chai = require('chai');
import fetch from 'node-fetch';

chai.use(awsTesting);

const { expect } = chai;

describe('file service e2e tests', () => {
  const region = 'us-east-1';
  const bucket = 'file-service-s3-bucket-dev';

  beforeEach(async () => {
    await clearAllObjects(region, bucket);
  });

  afterEach(async () => {
    await clearAllObjects(region, bucket);
  });

  test('should create object in s3 on lambda invoke', async () => {
    const body = {
      file_url:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/240px-Google_2015_logo.svg.png',
      key: '240px-Google_2015_logo.svg.png',
    };

    const result = await invoke(region, 'file-service-dev-save', {
      body: JSON.stringify(body),
    });

    const parsedResult = JSON.parse(result.body);
    expect(parsedResult.message).to.be.equal('File saved');

    const expectedBuffer = await (await fetch(body.file_url)).buffer();

    await expect({ region, bucket, timeout: 0 }).to.have.object(
      body.key,
      expectedBuffer,
    );
  });
});
