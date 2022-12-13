/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import fetch, {Response} from 'node-fetch';

export interface ZenTokenResult {
  _messageCode_: string,
  message: string,
  token: string
}
export interface IamTokenResult {
  access_token: string,
  token_type: string,
  refresh_token: string,
  id_token: string,
  expires_in: number,
  scope: string
}

export interface ZenAuthApiClient {
  authorizeApiKey(username: string, apiKey: string): Promise<ZenTokenResult>,
  authorizeIamUserPassword(username: string, password: string): Promise<ZenTokenResult>,
  authorizeZenUserPassword(username: string, password: string): Promise<ZenTokenResult>
}

export enum ZenAuthApiClientErrorCode {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  INVALID_REQUEST = "INVALID_REQUEST"
}

export interface ZenAuthApiClientError extends Error {
  code: ZenAuthApiClientErrorCode;
  cause?: unknown;
}

export function getError(message: string, code: ZenAuthApiClientErrorCode, cause?: unknown) {
  const err: ZenAuthApiClientError = <ZenAuthApiClientError> new Error(message);
  err.cause = cause;
  err.code = code;

  return err;
}

export interface ZenAuthApiConfiguration {
  /**
   * The URL of the CloudPak server, e.g. https://cpd-aiops.apps.mycluster.example.com
   */
  url: string
}

export function ZenAuthApiClient(config: ZenAuthApiConfiguration) {
  const getUrl = (path: string) => new URL(path, config.url).href;

  const getErrorInfo = async (res: Response) => {
    try {
      return await res.json();
    } catch(ex) {
      return {
        message: `Response: ${await res.text()}`
      };
    }
  }

  return {
    async loginWithApiKey(url: string, username: string, apiKey: string): Promise<ZenTokenResult> {
      const response = await fetch(
        getUrl('/icp4d-api/v1/authorize'),
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            api_key: apiKey
          })
        }
      );

      if (response.ok) {
        try {
          return response.json();
        } catch (err) {
          throw getError(
            'Invalid response from bundle API',
            ZenAuthApiClientErrorCode.INVALID_RESPONSE,
            err
          );
        }
      }

      switch (response.status) {
        case 400:
          throw getError(
            'Invalid request',
            ZenAuthApiClientErrorCode.INVALID_REQUEST,
            await getErrorInfo(response)
          );

        case 401:
        case 403:
          throw getError(
            'Received unauthorized response, validate your credentials are correct and you have access',
            ZenAuthApiClientErrorCode.UNAUTHORIZED,
            await getErrorInfo(response)
          );

        default:
          throw getError(
            'Error returned from API',
            ZenAuthApiClientErrorCode.INTERNAL_ERROR,
            await getErrorInfo(response)
          );
      }
    }
  };
}
