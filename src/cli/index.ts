/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';

yargs(hideBin(process.argv))
  .option('insecure', {
    description: 'If enabled, the certificate presented by the API will not be validated',
    boolean: true
  })
  .middleware(argv => {
    if (argv.insecure) {
      process.removeAllListeners('warning');
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
  })
  .commandDir('cmds', {
    extensions: ['js', 'ts']
  })
  .demandCommand()
  .help()
  .argv;
