/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import chalk from 'chalk';

const symbols = {
	info: chalk.blue('ℹ'),
	success: chalk.green('✔'),
	warning: chalk.yellow('⚠'),
	error: chalk.red('✖'),
};

export function taskStarted(taskName: string, description: string) {
  return line(chalk.blue(`${symbols.info} [${taskName}] started: `)) +
    line(indent(chalk.grey(description), 2));
}

export function taskSuccess(taskName: string, description: string) {
  return line(chalk.green(`${symbols.success} [${taskName}] complete`)) +
    line(indent(chalk.grey(description), 2));
}

export function taskFailed(taskName: string, err: unknown) {
  let output = '';

  output += line(chalk.red(`${symbols.error} ${taskName} failed: `));

  output += indent(error(err), 2);

  return output;
}

export function error(err: unknown) {
  let output = '';

  if (err instanceof Error) {
    const extendedErr = <ExtendedError>err;
    if (extendedErr.code) {
      output += line(`${chalk.bold(extendedErr.code)} ${err.message}`);
    } else {
      output += line(`${err.message}`);
    }

    if (err.stack) {
      output += line(indent(err.stack, 2));
    }

    if (extendedErr.cause) {
      output += line(indent('Caused by:', 2));
      output += indent(error(extendedErr.cause), 4);
    }
  } else {
    output += line(JSON.stringify(err, null, 2));
  }

  return output;
}

export function log(str: string) {
  console.log(str);
}

export function line(str: string) {
  return `${str}\n`;
}

export function indent(str: string, chars: number) {
  return str.split('\n').map(line => `${' '.repeat(chars)}${line}`).join('\n');
}

interface ExtendedError extends Error {
  cause?: unknown,
  code?: string
}
