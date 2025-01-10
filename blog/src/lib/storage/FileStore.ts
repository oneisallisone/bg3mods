import { promises as fs } from "fs";
import path from "path";
import { IFileStore } from "./IFileStore";
import { FileMetadata, StorageError, StorageOptions, ReadOptions, WriteOptions } from "@/types/storage";

export class FileStore implements IFileStore {
  private basePath: string;
  private encoding: BufferEncoding;
  private lockTimeout: number;

  constructor(options: StorageOptions) {
    this.basePath = options.basePath;
    this.encoding = options.encoding || "utf8";
    this.lockTimeout = options.lockTimeout || 5000;
  }

  private resolvePath(relativePath: string): string {
    const normalizedPath = path.normalize(relativePath);
    if (normalizedPath.startsWith("..")) {
      throw new StorageError(
        "Path traversal is not allowed",
        "INVALID_PATH",
        relativePath
      );
    }
    return path.join(this.basePath, normalizedPath);
  }

  async read(filePath: string, options: ReadOptions = {}): Promise<string> {
    const fullPath = this.resolvePath(filePath);
    try {
      const content = await fs.readFile(fullPath, this.encoding);
      return content;
    } catch (error: any) {
      throw new StorageError(
        `Failed to read file: ${error.message}`,
        "READ_ERROR",
        filePath
      );
    }
  }

  async write(
    filePath: string,
    content: string,
    options: WriteOptions = {}
  ): Promise<void> {
    const fullPath = this.resolvePath(filePath);
    try {
      const exists = await this.exists(filePath);

      if (exists && !options.overwrite) {
        throw new StorageError(
          "File already exists",
          "FILE_EXISTS",
          filePath
        );
      }

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      await fs.writeFile(fullPath, content, this.encoding);
    } catch (error: any) {
      throw new StorageError(
        `Failed to write file: ${error.message}`,
        "WRITE_ERROR",
        filePath
      );
    }
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = this.resolvePath(filePath);
    try {
      await fs.unlink(fullPath);
    } catch (error: any) {
      throw new StorageError(
        `Failed to delete file: ${error.message}`,
        "DELETE_ERROR",
        filePath
      );
    }
  }

  async stat(filePath: string): Promise<FileMetadata> {
    const fullPath = this.resolvePath(filePath);
    try {
      const stats = await fs.stat(fullPath);
      return {
        name: path.basename(filePath),
        path: filePath,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } catch (error: any) {
      throw new StorageError(
        `Failed to get file stats: ${error.message}`,
        "STAT_ERROR",
        filePath
      );
    }
  }

  async exists(filePath: string): Promise<boolean> {
    const fullPath = this.resolvePath(filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async list(dirPath: string): Promise<FileMetadata[]> {
    const fullPath = this.resolvePath(dirPath);
    try {
      const files = await fs.readdir(fullPath);
      const metadataPromises = files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        return await this.stat(filePath);
      });
      return Promise.all(metadataPromises);
    } catch (error: any) {
      throw new StorageError(
        `Failed to list directory: ${error.message}`,
        "LIST_ERROR",
        dirPath
      );
    }
  }

  async mkdir(dirPath: string): Promise<void> {
    const fullPath = this.resolvePath(dirPath);
    try {
      await fs.mkdir(fullPath, { recursive: true });
    } catch (error: any) {
      throw new StorageError(
        `Failed to create directory: ${error.message}`,
        "MKDIR_ERROR",
        dirPath
      );
    }
  }

  async rmdir(dirPath: string): Promise<void> {
    const fullPath = this.resolvePath(dirPath);
    try {
      await fs.rm(fullPath, { recursive: true });
    } catch (error: any) {
      throw new StorageError(
        `Failed to remove directory: ${error.message}`,
        "RMDIR_ERROR",
        dirPath
      );
    }
  }
}
