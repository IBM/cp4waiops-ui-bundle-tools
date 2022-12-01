/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */

export interface UploadBundleResult {
  etag: string,
  versionId: string,
  name: string
}

export interface BundleApiClient {
  uploadBundle(tenantId: string, bundleId: string, zipFile: Buffer): Promise<UploadBundleResult[]>;
}


export enum BundleApiClientErrorCode {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  INVALID_REQUEST = "INVALID_REQUEST"
}

export interface BundleApiClientError extends Error {
  code: BundleApiClientErrorCode;
  cause?: unknown;
}

export function getError(message: string, code: BundleApiClientErrorCode, cause?: unknown) {
  const err: BundleApiClientError = <BundleApiClientError> new Error(message);
  err.cause = cause;
  err.code = code;

  return err;
}
