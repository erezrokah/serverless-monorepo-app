const ENDPOINT = process.env.REACT_APP_API_SERVICE_ENDPOINT || '';

const PUBLIC_ENDPOINT = `${ENDPOINT}/api/public`;
const PRIVATE_ENDPOINT = `${ENDPOINT}/api/private`;

const EMAIL_ENDPOINT = `${process.env.REACT_APP_EMAIL_SERVICE_ENDPOINT ||
  ''}/email`;

export const checkStatus = (response: Response, message: string) => {
  if (response.ok) {
    return response;
  } else {
    const error = new Error(message);
    throw error;
  }
};

export const publicApi = async () => {
  const response = await fetch(PUBLIC_ENDPOINT, {
    cache: 'no-store',
    method: 'POST',
  });

  const { message } = await response.json();
  return message;
};

export const privateApi = async () => {
  const token = localStorage.getItem('id_token');
  const response = await fetch(PRIVATE_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
  });

  const { message } = await response.json();
  checkStatus(response, message);

  return message;
};

export const emailApi = async (toAddress: string) => {
  const token = localStorage.getItem('id_token');
  const response = await fetch(EMAIL_ENDPOINT, {
    body: JSON.stringify({ to_address: toAddress }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
  });

  const { message } = await response.json();
  checkStatus(response, message);

  return message;
};
