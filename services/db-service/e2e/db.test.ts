import { clearAllItems } from 'jest-e2e-serverless/lib/utils/dynamoDb';
import { invoke } from 'jest-e2e-serverless/lib/utils/lambda';

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

    expect.assertions(1);
    await expect({ region, table, timeout: 0 }).toHaveItem(
      { id: lambdaItem.id },
      lambdaItem,
    );
  });
});
