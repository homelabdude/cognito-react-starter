# Cognitor React Starter

![CI Status Badge](https://github.com/ash0ne/cognito-react-starter/actions/workflows/ci.yaml/badge.svg)

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Config](#config)
- [Components](#component-structure)

## Overview

- This project has all the necessary frontend and the sample code required to create a web app with Cognito oAuth
- This frontend is designed to be fully functional as a standalone application irrespective of the backend you choose to use but has sections that seamlessly work with the APIs in [cognito-springboot-starter](https://github.com/ash0ne/cognito-springboot-starter).
- This frontend project was originally initiated with [Create React App](https://github.com/facebook/create-react-app) and has now been migrated to user Vite.

## Getting Started

- Before using this application, it's necessary to set up an [AWS Cognito Identity Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-with-identity-pools.html) and have a User and a User Group created . This process is pretty straightforward.

- Upon setting up the Identity Pool, make sure to replace the placeholders in `src/aws-export.js` with your Cognito Identity Pool configuration values.

  > Note: When creating the Cognito Identity Pool, ensure it is created without an App Client Secret. This is a common practice as frontend applications typically have no secure way of storing the secret. Refer to [this Stack Overflow thread](https://stackoverflow.com/questions/47916034/what-is-a-cognito-app-client-secret) for more information.

- For effortless testing of this frontend without the need for backend integration, simply execute `sh local_test_backend/run-mock-backend.sh` This launches a basic express backend, which responds to the `api/v1/persons` path, serving as a mock to the API calls made by this frontend sample.

## Config

- **AWS Cognito**

These are pretty much the only things you have to change to get the app running

- Update `src/aws-export.js` with the right Cognito config
- Update `.env.development` with the right backend URL
- If you want to build it, make sure to have an `.env.production` with the correct backend config

## Component Structure

The project follows a structured component organization to showcase various functionalities. The main ones to focus on are listed below:

- **App**:
  - Contains the router setup and demonstrates the configuration required for authorized and unauthorized routes.
- **Home**:
  - Provides a boilerplate layout for an application home page, which can be customized as needed.
- **Dashboard**:
  - Features a dashboard with a navbar that includes user details, an option to sign out, and two sections.
  - **Section 1**: Displays all the ID and Access token details retrieved from the Cognito Identity Pool.
  - **Section 2**: Illustrates how these tokens can be utilized to make API calls to the backend.
