/* eslint-disable prettier/prettier */
const { program } = require('commander');
const shell = require('shelljs');
const path = require('path');
const dotenv = require('dotenv');

if (!shell.which('aws')) {
  shell.echo('Sorry, this script requires aws CLI');
  shell.exit(1);
}
if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

// Initialize the commander program
program
  .version('0.1.0')
  .option('-s, --stage [stage]', 'Specify the AWS deployment stage', 'dev')
  .option('-a, --application [application]', 'Specify the application to deploy')
  .option('-f, --force', 'Force the deployment')
  .parse(process.argv);

const options = program.opts();

if (!options.application || process.env.APPLICATION) {
  console.error('Application was not provided. Exiting...');
  shell.exit(1);
}

const envFilePath = path.join(__dirname, `../.env.${options.stage}`);
dotenv.config({ path: envFilePath });
options.profile = process.env.AWS_PROFILE;
options.region = process.env.AWS_REGION;
console.log(`Environment variables loaded successfully for stage: ${options.stage}`);

console.log(
  `Deploying Application=${options.application ? options.application : 'ALL'}, Stage=${options.stage}, Region=${options.region}, Profile=${options.profile}`
);

// Get AWS Account ID using AWS CLI
const getAccountIdCmd = `aws sts get-caller-identity --output json --profile ${options.profile}`;
const result = shell.exec(getAccountIdCmd, { silent: true });
if (result.code !== 0) {
    console.error('Failed to execute AWS CLI command:', result.stderr);
    process.exit(1);
}
const awsAccountId = JSON.parse(result).Account.trim();
console.log(`ACCOUNT_ID is ${awsAccountId}`);

if (!awsAccountId) {
  shell.echo('Failed to retrieve AWS Account ID. Exiting...');
  shell.exit(1);
}

shell.cd('apps');
console.log(`Deploying from directory: ${options.application}`);
shell.cd(options.application);

  // Install npm dependencies
//   if (shell.exec('npm install').code !== 0) {
//     shell.echo('Error installing npm packages.');
//     shell.exit(1);
//   }

 
// Check if 'serverless.yml' exists and perform serverless deployment
if (shell.test('-e', 'serverless.yml')) {
    shell.env.REGION = `${options.region}`;
    shell.env.ACCOUNT_ID = `${awsAccountId}`;
    shell.env.AWS_PROFILE = `${options.profile}`;
    shell.env.SLS_DEBUG = `true`;
    shell.env.STAGE = `${options.stage}`;
 
    const offlineCommand = `rm -rf .build && serverless offline --stage ${options.stage} --region ${options.region} --aws-profile ${options.profile}`;

    console.log(`Current App: ${options.application}`);
    console.log(`Current path: ${shell.pwd()}`);
    console.log(`Executing deployment: ${offlineCommand}`);
    if (shell.exec(offlineCommand).code !== 0) {
        shell.echo('Serverless Offline start failed.');
        shell.exit(1);
    }
} else {
    console.log('No serverless.yml found, skipping...');
}

// Navigate back to the apps directory
shell.cd('..');

