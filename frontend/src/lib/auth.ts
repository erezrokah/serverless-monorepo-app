import { Auth0DecodedHash, WebAuth } from 'auth0-js';

const auth = new WebAuth({
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID || '',
  domain: process.env.REACT_APP_AUTH0_DOMAIM || '',
  redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
  responseType: 'token id_token',
  scope: 'openid profile email',
});

const setSession = (authResult: Auth0DecodedHash) => {
  const { expiresIn = 0, accessToken = '', idToken = '' } = authResult;
  // Set the time that the access token will expire at
  const expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime());
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('id_token', idToken);
  localStorage.setItem('expires_at', expiresAt);
};

const handleAuthentication = async () => {
  const promise: Promise<Auth0DecodedHash> = new Promise((resolve, reject) => {
    auth.parseHash((err, authResult) => {
      const result = authResult || {};
      if (err) {
        reject(err);
      } else {
        setSession(result);
        resolve(result);
      }
    });
  });
  return await promise;
};

const login = (state: string) => auth.authorize({ state });

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
};

const isAuthenticated = () => {
  // Check whether the current time is past the
  // access token's expiry time
  const expiresAt = JSON.parse(
    localStorage.getItem('expires_at') || JSON.stringify(0),
  );
  return new Date().getTime() < expiresAt;
};

export { handleAuthentication, login, logout, isAuthenticated };
