/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import fetch, {Response} from 'node-fetch';
import FormData from 'form-data';
import {URL} from 'url';
import { BundleApiClient, BundleApiClientErrorCode, getError } from "./BundleApiClient";

export interface BundleApiConfiguration {
  /**
   * The URL for the CloudPak for Watson AIOps server
   */
  url: string,

  /**
   * An authentication token to use
   */
  token: string
}

export function AiopsBundleApiClient(config: BundleApiConfiguration): BundleApiClient {
  const getUrl = (path: string) => new URL(path, config.url).href;

  const getErrorInfo = async (res: Response) => {
    const clone = res.clone();
    try {
      return await res.json();
    } catch(ex) {
      return {
        message: `Response: ${await clone.text()}`
      };
    }
  }

  const getAuthHeader = (token: string) => `bearer ${token}`;

  return {
    async uploadBundle(tenantId, bundleId, zipFile) {
      const formData = new FormData()

      formData.append('files', zipFile, {
        contentType: 'application/zip',
        filename: 'bundle.zip',
        knownLength: zipFile.length
      });
      formData.append('bundleId', bundleId);

      const uploadRes = await fetch(
        getUrl(`/aiops/${encodeURIComponent(tenantId)}/bundles`),
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: getAuthHeader(config.token)
          }
        }
      )

      if (uploadRes.ok) {
        try {
          return uploadRes.json();
        } catch (err) {
          throw getError(
            'Invalid response from bundle API',
            BundleApiClientErrorCode.INVALID_RESPONSE,
            err
          );
        }
      }

      switch (uploadRes.status) {
        case 400:
          throw getError(
            'Invalid request, verify your zip file is valid',
            BundleApiClientErrorCode.INVALID_REQUEST,
            await getErrorInfo(uploadRes)
          );

        case 401:
        case 403:
          throw getError(
            'Received unauthorized response, validate your credentials are correct and you have access',
            BundleApiClientErrorCode.UNAUTHORIZED,
            await getErrorInfo(uploadRes)
          );

        default:
          throw getError(
            'Error returned from API',
            BundleApiClientErrorCode.INTERNAL_ERROR,
            await getErrorInfo(uploadRes)
          );
      }
    },
  };
}
