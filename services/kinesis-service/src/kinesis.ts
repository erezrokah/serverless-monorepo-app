import { Kinesis } from 'aws-sdk';
import { v1 as uuid } from 'uuid';

const StreamName = process.env.Stream || '';

interface IRecord {
  message: string;
}

const headers = {
  /* Required for cookies, authorization headers with HTTPS */
  'Access-Control-Allow-Credentials': true,
  /* Required for CORS support to work */
  'Access-Control-Allow-Origin': '*',
};

const isString = (x: any): x is string => typeof x === 'string';

const isRecord = (item: any) => {
  if (isString(item.message)) {
    return true;
  }
  return false;
};

export const queueEvent = async (body: string | null) => {
  const kinesis = new Kinesis();

  let item = null;
  if (body) {
    try {
      const parsed = JSON.parse(body);
      item = parsed.record as IRecord;
    } catch (e) {
      console.log('Invalid body', e);
    }
  }

  if (item && isRecord(item)) {
    const record = { message: item.message, id: uuid() };
    const params = {
      Data: JSON.stringify({
        record,
        timestamp: new Date().toISOString(),
      }),
      PartitionKey: record.id,
      StreamName,
    };
    await kinesis.putRecord(params).promise();
    const response = {
      body: JSON.stringify({
        data: { message: 'Record saved', id: record.id },
        input: body,
      }),
      headers,
      statusCode: 200,
    };
    return { response, error: null };
  } else {
    const response = {
      body: JSON.stringify({
        input: body,
        message: 'Bad input data',
      }),
      headers,
      statusCode: 422,
    };
    return { response, error: null };
  }
};
