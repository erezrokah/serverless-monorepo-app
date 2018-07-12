import sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const from = `<demo@erez.sendgrid.com>`;
export const subject = 'Serverless Email Demo';
export const text = 'Sample email sent from Serverless Email Demo.';
export const html = `
<html>
  <title>Serverless Email Demo</title>
  <body>
    <div>
      <h1>Serverless Email Demo</h1>
      <span>Sample email sent from Serverless Email Demo.</span>
    </div>
  </body>
</html>
`;

export const sendMail = async (body: string | null) => {
  let to = '';
  if (body) {
    try {
      to = JSON.parse(body).to_address || '';
    } catch (e) {
      console.log('Invalid body', e);
    }
  }

  if (to !== '') {
    const msg = {
      from,
      html,
      subject,
      text,
      to,
    };

    try {
      const [, input] = await sgMail.send(msg);
      const response = {
        body: JSON.stringify({
          input,
          message: 'Request to send email is successful.',
        }),
        headers: {
          /* Required for cookies, authorization headers with HTTPS */
          'Access-Control-Allow-Credentials': true,
          /* Required for CORS support to work */
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 202,
      };
      console.log(response);
      return { response, error: null };
    } catch (error) {
      console.log(error);
      const response = {
        body: JSON.stringify({
          input: body,
          message: 'Unknown Error',
        }),
        headers: {
          /* Required for cookies, authorization headers with HTTPS */
          'Access-Control-Allow-Credentials': true,
          /* Required for CORS support to work */
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 500,
      };
      return { response, error };
    }
  } else {
    const response = {
      body: JSON.stringify({
        input: body,
        message: 'Bad input data or missing email address.',
      }),
      headers: {
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true,
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 422,
    };
    return { response, error: null };
  }
};
