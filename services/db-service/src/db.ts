import AWS = require('aws-sdk');
import uuid = require('uuid/v1');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.DYNAMODB_TABLE || '';

export const create = async (body: string | null) => {
  let text = '';
  if (body) {
    try {
      const parsed = JSON.parse(body);
      text = parsed.text || '';
    } catch (e) {
      console.log('Invalid body', e);
    }
  }

  if (text !== '' && typeof text === 'string') {
    try {
      const createdAt = new Date().getTime();
      const params = {
        Item: {
          checked: false,
          createdAt,
          id: uuid(),
          text,
          updatedAt: createdAt,
        },
        TableName,
      };

      // write the todo to the database
      await dynamoDb.put(params).promise();

      // create a response
      const response = {
        body: JSON.stringify(params.Item),
        statusCode: 200,
      };
      return { response, error: null };
    } catch (error) {
      console.log(error);
      const response = {
        body: JSON.stringify({
          input: body,
          message: "Couldn't create the todo item.",
        }),
        statusCode: 500,
      };
      return { response, error };
    }
  } else {
    const response = {
      body: JSON.stringify({
        input: body,
        message: 'Bad input data or missing text',
      }),
      statusCode: 422,
    };
    return { response, error: null };
  }
};
