import { S3 } from 'aws-sdk';
import fetch from 'node-fetch';

const Bucket = process.env.BUCKET || '';

const headers = {
  /* Required for cookies, authorization headers with HTTPS */
  'Access-Control-Allow-Credentials': true,
  /* Required for CORS support to work */
  'Access-Control-Allow-Origin': '*',
};

export const saveFile = async (body: string | null) => {
  const s3 = new S3();

  let fileUrl = '';
  let key = '';
  if (body) {
    try {
      const parsed = JSON.parse(body);
      fileUrl = parsed.file_url || '';
      key = parsed.key || '';
    } catch (e) {
      console.log('Invalid body', e);
    }
  }

  if (fileUrl !== '' && key !== '') {
    try {
      const fetchResponse = await fetch(fileUrl);
      if (fetchResponse.ok) {
        const buffer = await fetchResponse.buffer();
        await s3
          .putObject({
            Body: buffer,
            Bucket,
            Key: key,
          })
          .promise();
        const response = {
          body: JSON.stringify({
            input: body,
            message: 'File saved',
          }),
          headers,
          statusCode: 200,
        };
        return { response, error: null };
      } else {
        const response = {
          body: JSON.stringify({
            input: body,
            message: 'Fetch failed',
          }),
          headers,
          statusCode: 500,
        };
        const error = new Error(
          `Failed to fetch ${fetchResponse.url}: ${fetchResponse.status} ${
            fetchResponse.statusText
          }`,
        );
        return { response, error };
      }
    } catch (error) {
      console.log(error);
      const response = {
        body: JSON.stringify({
          input: body,
          message: 'Unknown Error',
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
        message: 'Bad input data or missing file url.',
      }),
      headers,
      statusCode: 422,
    };
    return { response, error: null };
  }
};
