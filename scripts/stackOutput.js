const path = require('path');
const fs = require('fs-extra');
const dotenv = require('dotenv');
const os = require('os');

const replaceInEnvFile = async (file, envs) => {
  const keys = Object.keys(envs);
  if (keys.length <= 0) {
    return;
  }

  const envFile = path.join(__dirname, '../frontend', file);
  await fs.ensureFile(envFile);
  const content = await fs.readFile(envFile);
  const envConfig = await dotenv.parse(content);

  keys.forEach(key => {
    envConfig[key] = envs[key];
  });

  await fs.remove(envFile);
  await Promise.all(
    Object.keys(envConfig).map(key =>
      fs.appendFile(envFile, `${key}=${envConfig[key]}${os.EOL}`),
    ),
  );
};

const handler = async (data, serverless, _) => {
  //this handler creates the environment for the frontend based on the services deployment output
  const { ServiceEndpoint, WebAppCloudFrontDistributionOutput } = data;

  if (WebAppCloudFrontDistributionOutput) {
    await replaceInEnvFile('.env.production.local', {
      REACT_APP_AUTH0_REDIRECT_URI: `https://${WebAppCloudFrontDistributionOutput}/callback`,
    });
  }

  if (ServiceEndpoint) {
    const serviceName = serverless.service.serviceObject.name
      .replace(/\-/g, '_')
      .toUpperCase();

    await replaceInEnvFile('.env.local', {
      [`REACT_APP_${serviceName}_ENDPOINT`]: ServiceEndpoint,
    });
  }
};

module.exports = { handler };
