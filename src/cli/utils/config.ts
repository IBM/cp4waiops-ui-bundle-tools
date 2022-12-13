/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { join } from 'path';
import { homedir } from 'os';
import fs from 'fs/promises';
import { log, error } from './output';

const CONFIG_FILE_PATH = process.env.AIOPS_CLI_CONFIG_PATH ?? join(homedir(), '.aiops-ui.json');

async function readJsonFile(filePath: string) {
  const jsonText = await fs.readFile(filePath, 'utf8');

  return JSON.parse(jsonText);
}

async function writeJsonFile(filePath: string, content: unknown) {
  const jsonText = JSON.stringify(content, null, 2);

  return await fs.writeFile(filePath, jsonText, 'utf8');
}

function decodeSecret(secret: string) {
  return Buffer.from(secret, 'base64').toString();
}

function encodeSecret(secret: string) {
  return Buffer.from(secret, 'utf8').toString('base64');
}

export type Config = {
  authToken?: string,
  zenUrl?: string
};

/**
 * Retrieve configuration from disk
 * @param ignoreErrors If true, don't log any errors
 */
export async function getConfig(ignoreErrors = false): Promise<Config> {
  try {
    const rawConfig = await readJsonFile(CONFIG_FILE_PATH);

    return {
      authToken: rawConfig.authToken && decodeSecret(rawConfig.authToken),
      zenUrl: rawConfig.zenUrl
    };
  } catch(e) {
    if (!ignoreErrors) {
      log(`Failed to read configuration file from ${CONFIG_FILE_PATH}`);
      log(error(e));
    }

    return {};
  }
}

/**
 * Persist a configuration to disk
 * @param config The configuration to persist
 */
export async function saveConfig(config: Config) {
  await writeJsonFile(CONFIG_FILE_PATH, {
    authToken: config.authToken && encodeSecret(config.authToken),
    zenUrl: config.zenUrl
  });
}

/**
 * Updates only some configuration parameters, merging with the existing
 * ones
 *
 * @param config Updated configuration parameters
 */
export async function updateConfig(config: Config) {
  const currentConfig = await getConfig(true);

  await saveConfig({...currentConfig, ...config});
}
