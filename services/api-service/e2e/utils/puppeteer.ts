import * as puppeteer from 'puppeteer';
import { URLSearchParams } from 'url';

const createNonce = (length: number) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const auth0Login = async (
  domain: string,
  clientId: string,
  email: string,
  password: string,
  redirectUri: string,
) => {
  const browser = await puppeteer.launch();

  const [page] = await browser.pages();

  // urls hold redirect chain
  const urls = [] as string[];

  // Get all redirects
  page.on('response', response => {
    const status = response.status();
    if (status >= 300 && status <= 399) {
      urls.push(response.headers()['location']);
    }
  });

  const nonce = createNonce(32);

  await page.goto(
    `https://${domain}/authorize?client_id=${clientId}&response_type=id_token token&nonce=${nonce}&redirect_uri=${redirectUri}`,
    { waitUntil: 'networkidle2' },
  );

  await page.waitForXPath("//a[contains(text(), 'Sign Up')]", {
    timeout: 5000,
    visible: true,
  });
  const signUp = await page.$x("//a[contains(text(), 'Sign Up')]");
  await signUp[0].click();

  await page.waitForSelector('input[name="email"]', {
    timeout: 5000,
    visible: true,
  });
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForSelector('button[id="allow"]', {
    timeout: 5000,
    visible: true,
  });
  await page.click('button[id="allow"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  const clientUrl = urls.filter(u => u.startsWith(redirectUri))[0];
  let token = '';
  if (clientUrl) {
    const hashQuery = clientUrl.substring(
      redirectUri.length + '/'.length + '#'.length,
    );
    const params = new URLSearchParams(hashQuery);
    token = params.get('id_token') || '';
    console.log('Login success, token:', token);
  } else {
    console.error('Login failed. Current url:', clientUrl);
  }

  await browser.close();
  return `Bearer ${token}`;
};
