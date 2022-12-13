/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import {ArgumentsCamelCase, Argv} from 'yargs';
import { AiopsBundleApiClient } from '../../clients/AiopsBundleApiClient';
import { UploadBundleTask } from '../../tasks/UploadBundleTask';
import { indent, line, log, taskFailed, taskStarted, taskSuccess, error } from '../utils/output';
import { getConfig } from '../utils/config';

export interface Arguments {
  'tenant-id': string,
  'bundle-path': string,
  'bundle-id': string
}

export const command = 'deploy [options]';
export const description =  'Deploys a UI extension bundle to the server';
export const builder = (yargs: Argv<Arguments>) => yargs
  .option('tenant-id', {
    description: 'The tenant id under which the bundle should be uploaded',
    default: 'cfd95b7e-3bc7-4006-a4a8-a73a79c71255'
  })
  .option('bundle-id', {
    description: 'The id to assign the bundle on the server',
    demandOption: true
  })
  .option('bundle-path', {
    description: 'The path of the directory containing the bundle',
    demandOption: true
  });

export const handler = async (argv: ArgumentsCamelCase<Arguments>) => {
  const config = await getConfig();

  if (!config.zenUrl || !config.authToken) {
    log(error('Please login first using the login command'));
    return;
  }

  const bundleClient = AiopsBundleApiClient({
    url: config.zenUrl,
    token: config.authToken
  })

  const uploadBundleTask = UploadBundleTask(bundleClient);

  log(taskStarted(
    'Upload bundle',
     line(`Bundle path: ${argv.bundlePath}`) +
     line(`API url: ${argv.url}`) +
     line(`Bundle id: ${argv.bundleId}`)
  ));

  try {
    const result = await uploadBundleTask.uploadBundleFromDirectory(argv.tenantId, argv.bundleId, argv.bundlePath);
    log(taskSuccess(
      'Upload bundle',
      line(`Uploaded files:`) +
      indent(result.map(f => `- ${f.name} (etag: ${f.etag})`).join('\n'), 2)
    ));
  } catch (e) {
    log(taskFailed('Upload budle', e));
  }
};
