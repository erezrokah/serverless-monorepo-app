const { spawn } = require('child_process');
const { EOL } = require('os');

const deploy = async () => {
  await new Promise((resolve, reject) => {
    const serverless = spawn('serverless', ['deploy', '--stage', 'dev']);

    console.log(`${EOL}Deploying Service`);
    serverless.stdout.on('data', data => {
      console.log(data.toString().trim());
    });

    serverless.stderr.on('data', data => {
      console.log(data.toString().trim());
    });

    serverless.on('close', code => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve(code);
      }
    });
  });
};

module.exports = deploy;
