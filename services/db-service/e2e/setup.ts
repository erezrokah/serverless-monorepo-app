import { deploy } from 'jest-e2e-serverless/lib/utils/serverless';

const deployDev = async () => {
  await deploy('dev');
};

export default deployDev;
