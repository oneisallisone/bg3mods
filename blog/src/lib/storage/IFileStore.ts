import { FileMetadata, ReadOptions, WriteOptions } from "../../types/storage";

export interface IFileStore {
  /**
   * Read file content
   */
  read(path: string, options?: ReadOptions): Promise<string>;

  /**
   * Write content to file
   */
  write(path: string, content: string, options?: WriteOptions): Promise<void>;

  /**
   * Delete file
   */
  delete(path: string): Promise<void>;

  /**
   * Get file metadata
   */
  stat(path: string): Promise<FileMetadata>;

  /**
   * Check if file exists
   */
  exists(path: string): Promise<boolean>;

  /**
   * List files in directory
   */
  list(path: string): Promise<FileMetadata[]>;

  /**
   * Create directory
   */
  mkdir(path: string): Promise<void>;

  /**
   * Remove directory
   */
  rmdir(path: string): Promise<void>;
}
