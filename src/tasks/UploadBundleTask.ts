/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { BundleApiClient } from '../clients/BundleApiClient';
import { directoryToZipBuffer } from '../utils/zip';

export function UploadBundleTask(client: BundleApiClient) {
  return {
    async uploadBundleFromDirectory(tenantId: string, bundleId: string, directoryPath: string) {
      const zipFile = await directoryToZipBuffer(directoryPath);
      const result = await client.uploadBundle(tenantId, bundleId, zipFile);

      return result;
    }
  }
}
