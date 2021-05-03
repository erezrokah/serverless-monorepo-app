# Serverless Monorepo App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/erezrokah/serverless-monorepo-app.svg?style=svg)](https://circleci.com/gh/erezrokah/serverless-monorepo-app)

This application is structured as a monorepo which means all the different packages sits under the same GitHub repository.

It makes it easier to have CI/CD and automate dependency management.

For example, under `frontend` sits the React application which consumes the services under `services`.

Since the endpoint urls for the services change between environments (dev/qa/prod) we need to setup the frontend app correctly.

Since all of our code sits in the same repository, we can update the frontend app environment based on the services deployment with ease.

This application uses `Auth0` for authentication, `Sendgrid` for sending emails, `CircleCI` for deployment and `AWS` as a cloud provider.

## Resources Used

- <https://serverless.com/blog/anatomy-of-a-serverless-app/>
- <https://serverless.com/blog/ci-cd-workflow-serverless-apps-with-circleci/>
- <https://serverless.com/framework/docs/providers/aws/guide/testing/>
- <https://github.com/serverless/examples/tree/master/aws-node-single-page-app-via-cloudfront>
- <https://github.com/serverless/examples/tree/master/aws-node-auth0-custom-authorizers-api>
- <https://serverless-stack.com/chapters/deploy-again.html>
- <https://github.com/serverless-heaven/serverless-webpack>
- <https://github.com/sbstjn/serverless-stack-output>
- <https://github.com/wmonk/create-react-app-typescript>

## Prerequisites

[Nodejs](https://nodejs.org/en/) (at least version 8)

[Yarn](https://yarnpkg.com/lang/en/)

Amazon AWS account and `awscli` installed and configured: <https://aws.amazon.com/getting-started/>

CircleCI [account](https://circleci.com/signup/)

Serverless [CLI](https://serverless.com/framework/docs/getting-started/)

[Auth0 account](https://auth0.com/)

[Sendgrid account](https://sendgrid.com/) for the email service

## Repository structure

This repository uses [lerna](https://lerna.js.org/) and yarn workspaces to handle dependencies.

The React frontend app sits under `frontend/`.

The Serverless services sit under `services/`.

Shared services code is under `services/common/` (e.g. both `api-service` and `email-service` use the same authentication handler).

Typescript is used across the repository.

## Setup

Install Dependencies

```bash
yarn install
```

CI/CD is setup for 3 different environments: `dev` (for local development), `qa` (for integration tests) and `prod` (production).

### Setup Environments

This part can be a bit tedious, but you only have to do it once.

#### Sendgrid

[Open Sendgrid settings](https://app.sendgrid.com/settings/api_keys)

For sending emails you'll need a Sendgrid API key for each environment you'll want to have (3 keys if you want `dev`,`qa` and `prod`).

Login into your Sendgrid account and create an API key (with email sending permissions) for each environment (you can name them `Serverless App Dev`, `Serverless App QA`, etc.).

Make sure to copy the API keys somewhere as you'll only see them once.

#### Auth0

[Open Auth0 management dashboard](https://manage.auth0.com)

The way to create different environments in Auth0 is to use something called **Tenants**.

You should create a tenant for each environment you'd like to use (you do it by clicking the icon for your account and choosing **Create tenant**).

A common setup is to have tenants named `mydomain-dev` for development, `mydomain-qa` for QA and `mydomain` for production.

After creating the relevant tenants you'll need to create an application (you can name it `Serverless Test App` or something similar).

You'll need your application's `Domain`, `Client ID`, `Audience` and the public key of the signing certificate.

`Domain` and `Client ID` are under `applications->${YOUR_APP_NAME}->settings`.

`Audience` is usually `https://YOUR_DOMAIN/userinfo` and to get the certificate you'll need to scroll down, go to `Show Advanced Settings->Certificates->DOWNLOAD CERTIFICATE`.

You should save the certificate in `PEM` format.

#### Setup Dev Environments Files

Run the following command to create the `dev` config files (make sure to update `your_certificate.pem`)

```bash
cp frontend/.env.example.local frontend/.env.local
cp services/common/environment/config.example.json services/common/environment/config.dev.json
cp services/email-service/config.example.json services/email-service/config.dev.json
mv your_certificate.pem services/common/environment/public_key.dev.pem
```

Update `frontend/.env.local`, `services/common/environment/config.dev.json` and `services/email-service/config.dev.json` with the relevant values.

#### Setup CircleCI

You'll need to add your project in CircleCI. In order to do it you'll probably need to fork this repository.

After you've done that you should add your AWS credentials under `Settings->AWS Permissions` (you should create a separate IAM User for that)

The last part left is to setup `qa` and `prod` environment variables for your project.

Under `Settings->Environment Variables` add the following items (update the values):

```bash
PROD_AUTH0_AUDIENCE
PROD_AUTH0_CLIENT_ID
PROD_AUTH0_DOMAIM
PROD_AUTH0_PUBLIC_KEY # This value should be base64 encoded, run `base64 ${LOCATION_TO_PEM_FILE}` to get the value
PROD_REGION # You can use `us-east-1` at the moment
PROD_SENDGRID_API_KEY
QA_AUTH0_AUDIENCE
QA_AUTH0_CLIENT_ID
QA_AUTH0_DOMAIM
QA_AUTH0_PUBLIC_KEY # This value should be base64 encoded, run `base64 ${LOCATION_TO_PEM_FILE}` to get the value
QA_REGION # You can use `us-east-1` at the moment
QA_SENDGRID_API_KEY
```

## Deployment

Development environment

```bash
yarn deploy:dev # deploys services and updates frontend configuration
yarn build:frontend # builds frontend application
yarn publish:frontend:dev # deploys frontend application
```

QA environment will be deployed automatically on each commit to master

Production environment will be deployed automatically on each version tag push, for example the following will trigger a production deployment:

```bash
git tag "v0.0.1"
git push --tags
```

## Post Deployment Setup

After deploying there is one last step to get Auth0 to work.

[Open Auth0 management dashboard](https://manage.auth0.com) and go to `applications->${YOUR_APP_NAME}->settings`.

Update `Allowed Callback URLs` with:

```bash
http://localhost:3000/callback,http://localhost:5000/callback,https://YOUR_CLOUDFRONT_DOMAIN/callback
```

Update `Allowed Web Origins` with:

```bash
http://localhost:3000,http://localhost:5000,https://YOUR_CLOUDFRONT_DOMAIN
```

You can get the domain value from here: <https://console.aws.amazon.com/cloudfront/home>

## Run Tests

```bash
yarn test
```

```bash
yarn coverage
```
