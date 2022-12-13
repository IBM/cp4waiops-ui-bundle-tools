/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
 import {ArgumentsCamelCase, Argv} from 'yargs';
 import { line, log, taskFailed, taskStarted, taskSuccess } from '../utils/output';
 import { loginWithApiKey } from '../utils/auth';

 export interface Arguments {
   url: string,
   username: string,
   'api-key': string
 }

 export const command = 'login [options]';
 export const description =  'Logs in to the api server';
 export const builder = (yargs: Argv<Arguments>) => yargs
   .option('url', {
     description: 'The url of the CloudPak for Watson AIOps server',
     demandOption: true
   })
   .option('username', {
     description: 'The username to login with',
   })
   .option('api-key', {
     description: 'The platform API key to login with'
   });

 export const handler = async (argv: ArgumentsCamelCase<Arguments>) => {
   log(taskStarted(
     'Login',
      line(`API url: ${argv.url}`)
   ));

   try {
     await loginWithApiKey(argv.url, argv.username, argv.apiKey);
     log(taskSuccess('Login', 'Logged in successfully'));
   } catch (e) {
     log(taskFailed('Login', e));
   }
 };
