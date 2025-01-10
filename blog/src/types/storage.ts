// Common types for the storage system

export type StorageOptions = {
  basePath: string;
  encoding?: BufferEncoding;
  lockTimeout?: number;
};

export type FileMetadata = {
  name: string;
  path: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
};

export type WriteOptions = {
  create?: boolean;
  overwrite?: boolean;
  lock?: boolean;
};

export type ReadOptions = {
  lock?: boolean;
};

export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public path?: string
  ) {
    super(message);
    this.name = "StorageError";
  }
}
