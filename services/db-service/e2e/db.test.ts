import AWS = require('aws-sdk');

const region = 'us-east-1';
AWS.config.update({ region });

const TableName = 'db-service-dev';
const clearAllItems = async () => {
  const db = new AWS.DynamoDB.DocumentClient();
  const scanResult = await db.scan({ TableName }).promise();
  await Promise.all(
    scanResult.Items.map(item =>
      db.delete({ TableName, Key: { id: item.id } }).promise(),
    ),
  );
};

describe('db service e2e tests', () => {
  beforeEach(async () => {
    await clearAllItems();
  });

  afterEach(async () => {
    await clearAllItems();
  });

  test('should create db entry on lambda invoke', async () => {
    const lambda = new AWS.Lambda();
    const params = {
      FunctionName: 'db-service-dev-create',
      Payload: JSON.stringify({
        body: JSON.stringify({ text: 'from e2e test' }),
      }),
    };

    const { Payload } = await lambda.invoke(params).promise();
    const lambdaItem = JSON.parse(JSON.parse(Payload.toString()).body);
    const db = new AWS.DynamoDB.DocumentClient();
    const dbItem = await db
      .get({ TableName, Key: { id: lambdaItem.id } })
      .promise();
    expect(lambdaItem).toEqual(dbItem.Item);
  });
});
