describe('auth lib', () => {
  const Mockdate = require('mockdate');

  const { localStorage } = global as any;
  const { getItem, setItem, removeItem } = localStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    Mockdate.reset();
  });

  afterEach(() => {
    Mockdate.reset();
  });

  test('should initialize WebAuth', () => {
    const audience = 'audience';
    const clientID = 'clientID';
    const domain = 'domain';
    const redirectUri = 'redirectUri';

    process.env.REACT_APP_AUTH0_AUDIENCE = audience;
    process.env.REACT_APP_AUTH0_CLIENT_ID = clientID;
    process.env.REACT_APP_AUTH0_DOMAIM = domain;
    process.env.REACT_APP_AUTH0_REDIRECT_URI = redirectUri;

    const { WebAuth } = require('auth0-js');
    require('./auth');

    expect(WebAuth).toHaveBeenCalledTimes(1);
    expect(WebAuth).toHaveBeenCalledWith({
      audience,
      clientID,
      domain,
      redirectUri,
      responseType: 'token id_token',
      scope: 'openid profile email',
    });
  });

  test('should call authorize on login', () => {
    const { authorize } = require('auth0-js');

    const state = 'state';

    const { login } = require('./auth');

    login(state);

    expect(authorize).toHaveBeenCalledTimes(1);
    expect(authorize).toHaveBeenCalledWith({ state });
  });

  test('should clear storage on logout', () => {
    const { logout } = require('./auth');

    logout();

    expect(removeItem).toHaveBeenCalledTimes(3);
    expect(removeItem).toHaveBeenCalledWith('access_token');
    expect(removeItem).toHaveBeenCalledWith('id_token');
    expect(removeItem).toHaveBeenCalledWith('expires_at');
  });

  test('should return false on isAuthenticated when expires_at=null', () => {
    Mockdate.set('1/1/2000');

    getItem.mockReturnValueOnce(null);

    const { isAuthenticated } = require('./auth');

    const result = isAuthenticated();

    expect(result).toBe(false);
    expect(getItem).toHaveBeenCalledTimes(1);
    expect(getItem).toHaveBeenCalledWith('expires_at');
  });

  test('should return true on isAuthenticated on valid date', () => {
    const currentDate = 100000000;
    const expiresAt = 200000000;

    Mockdate.set(currentDate);

    getItem.mockReturnValueOnce(JSON.stringify(expiresAt));

    const { isAuthenticated } = require('./auth');

    const result = isAuthenticated();

    expect(result).toBe(true);
  });

  test('should return false on isAuthenticated on expired date', () => {
    const currentDate = 200000000;
    const expiresAt = 100000000;

    Mockdate.set(currentDate);

    getItem.mockReturnValueOnce(JSON.stringify(expiresAt));

    const { isAuthenticated } = require('./auth');

    const result = isAuthenticated();

    expect(result).toBe(false);
  });

  test('should throw error on handleAuthentication auth.parseHash error', async () => {
    const { parseHash } = require('auth0-js');

    const error = new Error('error');

    parseHash.mockImplementation((callback: any) => {
      callback(error);
    });

    const { handleAuthentication } = require('./auth');

    expect.assertions(3);
    try {
      await handleAuthentication();
    } catch (e) {
      expect(e).toBe(error);
    }
    expect(parseHash).toHaveBeenCalledTimes(1);
    expect(parseHash).toHaveBeenCalledWith(expect.any(Function));
  });

  test('should update storage on handleAuthentication with auth results', async () => {
    const currentDate = 200000000;

    Mockdate.set(currentDate);

    const { parseHash } = require('auth0-js');

    const authResult = {
      accessToken: 'accessToken',
      expiresIn: 1000,
      idToken: 'idToken',
    };

    parseHash.mockImplementation((callback: any) => {
      callback(null, authResult);
    });

    const { handleAuthentication } = require('./auth');

    const result = await handleAuthentication();
    expect(result).toBe(authResult);
    expect(setItem).toHaveBeenCalledTimes(3);
    expect(setItem).toHaveBeenCalledWith(
      'access_token',
      authResult.accessToken,
    );
    expect(setItem).toHaveBeenCalledWith('id_token', authResult.idToken);
    expect(setItem).toHaveBeenCalledWith(
      'expires_at',
      `${authResult.expiresIn * 1000 + currentDate}`,
    );
  });

  test('should update storage on handleAuthentication with empty auth results', async () => {
    const currentDate = 200000000;

    Mockdate.set(currentDate);

    const { parseHash } = require('auth0-js');

    const authResult = {};

    parseHash.mockImplementation((callback: any) => {
      callback(null, authResult);
    });

    const { handleAuthentication } = require('./auth');

    const result = await handleAuthentication();
    expect(result).toBe(authResult);
    expect(setItem).toHaveBeenCalledTimes(3);
    expect(setItem).toHaveBeenCalledWith('access_token', '');
    expect(setItem).toHaveBeenCalledWith('id_token', '');
    expect(setItem).toHaveBeenCalledWith('expires_at', `${currentDate}`);
  });
});
