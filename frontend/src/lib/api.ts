const ENDPOINT = process.env.REACT_APP_API_SERVICE_ENDPOINT || '';

const PUBLIC_ENDPOINT = `${ENDPOINT}/api/public`;
const PRIVATE_ENDPOINT = `${ENDPOINT}/api/private`;

const EMAIL_ENDPOINT = `${process.env.REACT_APP_EMAIL_SERVICE_ENDPOINT ||
  ''}/email`;

const publicApi = async () => {
  try {
    const response = await fetch(PUBLIC_ENDPOINT, {
      cache: 'no-store',
      method: 'POST',
    });

    const data = await response.json();
    // tslint:disable
    console.log('Message:', data);
  } catch (err) {
    // tslint:disable
    console.log('error', err);
  }
};

const privateApi = async () => {
  try {
    const token = localStorage.getItem('id_token');
    const response = await fetch(PRIVATE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    });

    const data = await response.json();
    // tslint:disable
    console.log('Token:', data);
  } catch (err) {
    // tslint:disable
    console.log('error', err);
  }
};

const emailApi = async (to_address: string) => {
  try {
    const token = localStorage.getItem('id_token');
    const response = await fetch(EMAIL_ENDPOINT, {
      body: JSON.stringify({ to_address }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    });

    const data = await response.json();
    // tslint:disable
    console.log('Mail:', data);
  } catch (err) {
    // tslint:disable
    console.log('error', err);
  }
};

export { publicApi, privateApi, emailApi };
