import awsTesting from 'aws-testing-library/lib/chai';
import { clearAllItems } from 'aws-testing-library/lib/utils/dynamoDb';
import { invoke } from 'aws-testing-library/lib/utils/lambda';
import chai = require('chai');

chai.use(awsTesting);

const { expect } = chai;

describe('db service e2e tests', () => {
  const region = 'us-east-1';
  const table = 'db-service-dev';
  beforeEach(async () => {
    await clearAllItems(region, table);
  });

  afterEach(async () => {
    await clearAllItems(region, table);
  });

  test('should create db entry on lambda invoke', async () => {
    const result = await invoke(region, 'db-service-dev-create', {
      body: JSON.stringify({ text: 'from e2e test' }),
    });
    const lambdaItem = JSON.parse(result.body);

    await expect({ region, table, timeout: 0 }).to.have.item(
      { id: lambdaItem.id },
      lambdaItem,
    );
  });
});
