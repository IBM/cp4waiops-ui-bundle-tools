/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';

yargs(hideBin(process.argv))
  .commandDir('cmds', {
    extensions: ['js', 'ts']
  })
  .demandCommand()
  .help()
  .argv;
