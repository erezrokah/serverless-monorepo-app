import { deploy } from 'aws-testing-library/lib/utils/serverless';

const deployDev = async () => {
  await deploy('dev');
};

export default deployDev;
