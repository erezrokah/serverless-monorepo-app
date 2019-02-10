import axios from 'axios';

export interface IConfig {
  domain: string;
  clientId: string;
  clientSecret: string;
}

interface IUser {
  email: string;
  user_id: string;
}

const getAuthorization = async (
  domain: string,
  clientId: string,
  clientSecret: string,
) => {
  const response = await axios({
    data: JSON.stringify({
      audience: `https://${domain}/api/v2/`,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    url: `https://${domain}/oauth/token`,
  });
  const { token_type, access_token } = response.data;
  return `${token_type} ${access_token}`;
};

const getUsers = async (authorization: string, domain: string) => {
  const response = await axios({
    headers: { Authorization: authorization },
    method: 'GET',
    url: `https://${domain}/api/v2/users`,
  });
  return response.data as IUser[];
};

const deleteUser = async (
  authorization: string,
  domain: string,
  user: IUser,
) => {
  await axios({
    headers: { Authorization: authorization },
    method: 'DELETE',
    url: `https://${domain}/api/v2/users/${user.user_id}`,
  });
};

export const deleteUserByEmail = async (
  email: string,
  domain: string,
  clientId: string,
  clientSecret: string,
) => {
  const authorization = await getAuthorization(domain, clientId, clientSecret);
  const users = await getUsers(authorization, domain);
  // https://community.auth0.com/t/creating-a-user-converts-email-to-lowercase/6678
  const toDelete = users.filter(u => u.email === email.toLowerCase())[0];
  if (toDelete) {
    await deleteUser(authorization, domain, toDelete);
  }
};
