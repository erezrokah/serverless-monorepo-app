import { DynamoDB } from 'aws-sdk';
import { v1 as uuid } from 'uuid';

const TableName = process.env.DYNAMODB_TABLE || '';

const headers = {
  /* Required for cookies, authorization headers with HTTPS */
  'Access-Control-Allow-Credentials': true,
  /* Required for CORS support to work */
  'Access-Control-Allow-Origin': '*',
};

export const create = async (body: string | null) => {
  const dynamoDb = new DynamoDB.DocumentClient();

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
        headers,
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
        headers,
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
      headers,
      statusCode: 422,
    };
    return { response, error: null };
  }
};
