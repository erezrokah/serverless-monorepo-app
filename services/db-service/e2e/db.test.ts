import AWS = require('aws-sdk');
import { clearAllItems } from 'jest-e2e-serverless/lib/utils/dynamoDb';

describe('db service e2e tests', () => {
  const region = 'us-east-1';
  const tableName = 'db-service-dev';
  beforeEach(async () => {
    await clearAllItems(region, tableName);
  });

  afterEach(async () => {
    await clearAllItems(region, tableName);
  });

  test('should create db entry on lambda invoke', async () => {
    const lambda = new AWS.Lambda({ region });
    const params = {
      FunctionName: 'db-service-dev-create',
      Payload: JSON.stringify({
        body: JSON.stringify({ text: 'from e2e test' }),
      }),
    };

    const { Payload } = await lambda.invoke(params).promise();
    const lambdaItem = JSON.parse(JSON.parse(Payload.toString()).body);

    expect({ region, tableName }).toHaveItem({ id: lambdaItem.id }, lambdaItem);
  });
});
