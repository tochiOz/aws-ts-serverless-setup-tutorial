# Description
This repository shows a simple way to demonstrate serverless with microservices and how to communicate with DynamoDB.


# Setup
1. Setup AWS & Serverless, make sure you have an .aws directory in your user home folder that contains your credentials and config.

2. create a symkink
    ln -s /c/Users/Public/Documents/aws-ts-serverless-setup/apps/_shared /c/Users/Public/Documents/aws-ts-serverless-setup/apps/Others/shared

3. Duplicate the .env.template file based on the stage and set the variable values:
    ```sh
    cp .env.template .env.dev
    vim .env.dev
    ```
    for example:
    ```sh
    cp .env.template .env.personal
    vim .env.personal
    ```

4. Install dependencies in the root folder:
    ```sh
    npm i
    ```

5. Install dependencies for each app in the apps folder:
    ```sh
    cd apps/<app_name>
    npm i
    ```
    for example:
    ```sh
    cd apps/comments
    npm i
    ```

# Deploying the Database to AWS
1. Run the following command:
    ```sh
    npm run deploy --stage=<stage> --application=db
    ```
    for example:
    ```sh
    npm run deploy --stage=personal --application=db
    ```

# Running a Single Application Locally
1. Go to the apps folder and run the following command:
    ```sh
    cd apps/<app_name>
    npm run dev --stage=<stage>
    ```
    for example:
    ```sh
    cd apps/comments
    npm run dev --stage=personal
    ```
## Serverless Offline Setup
- sls dynamodb install
