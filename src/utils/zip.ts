/**
 * Copyright 2022- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import fs from 'fs/promises';
import fss from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function getDirFilePaths(dirPath: string) {
  let allPaths: string[] = [];

  const subPaths = await fs.readdir(dirPath);

  for (const subPath of subPaths) {
    const absSubPath = path.resolve(dirPath, subPath);
    const fileInfo = await fs.stat(absSubPath);

    if (fileInfo && fileInfo.isDirectory()) {
      allPaths = allPaths.concat(await getDirFilePaths(absSubPath));
    } else {
      allPaths.push(absSubPath);
    }
  }

  return allPaths;
}

/**
 * Compresses all files under a directory recursively into a zip file
 *
 * @param dirPath Path to the directory to compress
 * @returns A jszip zip file
 */
export async function directoryToZipFile(dirPath: string) {
  const absDirPath = path.resolve(dirPath);

  const zipFile = new JSZip();

  const dirFilePaths = await getDirFilePaths(dirPath);

  for (const filePath of dirFilePaths) {
    const relativePath = filePath.replace(absDirPath + '/', '');

    zipFile.file(relativePath, fss.createReadStream(filePath));
  }

  return zipFile;
}

/**
 * Compresses all files under a directory recursively into a zip file
 *
 * @param dirPath Path to the directory to compress
 * @returns A Uint8Array containing the compressed zip file
 */
export async function directoryToZipBuffer(dirPath: string) {
  return (await directoryToZipFile(dirPath)).generateAsync({type: 'nodebuffer'});
}
