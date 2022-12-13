/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import {updateConfig} from './config';
import {ZenAuthApiClient} from '../../clients/ZenAuthApiClient';

export async function loginWithApiKey(url: string, username: string, apiKey: string) {
  const client = ZenAuthApiClient({url});

  const tokens = await client.loginWithApiKey(url, username, apiKey);

  await updateConfig({
    authToken: tokens.token,
    zenUrl: url
  });
}
