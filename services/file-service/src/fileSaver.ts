import AWS = require('aws-sdk');
import fetch from 'node-fetch';

const s3 = new AWS.S3();

export const saveFile = async (body: string | null) => {
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
        const blob = await fetchResponse.buffer();
        await s3
          .putObject({
            Body: blob,
            Bucket: process.env.BUCKET || '',
            Key: key,
          })
          .promise();
        const response = {
          body: JSON.stringify({
            input: body,
            message: 'File saved',
          }),
          statusCode: 200,
        };
        return { response, error: null };
      } else {
        const response = {
          body: JSON.stringify({
            input: body,
            message: 'Fetch failed',
          }),
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
      statusCode: 422,
    };
    return { response, error: null };
  }
};
