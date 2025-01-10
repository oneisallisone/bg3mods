import { FileStore } from "../FileStore";
import { StorageError } from "@/types/storage";
import path from "path";
import { promises as fs } from "fs";

describe("FileStore", () => {
  const testDir = path.join(process.cwd(), "test-storage");
  let store: FileStore;

  beforeEach(async () => {
    store = new FileStore({ basePath: testDir });
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe("write and read", () => {
    it("should write and read file correctly", async () => {
      const content = "test content";
      await store.write("test.txt", content);
      const result = await store.read("test.txt");
      expect(result).toBe(content);
    });

    it("should throw error when reading non-existent file", async () => {
      await expect(store.read("nonexistent.txt")).rejects.toThrow(StorageError);
    });

    it("should not overwrite existing file without overwrite option", async () => {
      await store.write("test.txt", "original");
      await expect(
        store.write("test.txt", "new content")
      ).rejects.toThrow(StorageError);
    });
  });

  describe("delete", () => {
    it("should delete existing file", async () => {
      await store.write("test.txt", "content");
      await store.delete("test.txt");
      expect(await store.exists("test.txt")).toBe(false);
    });
  });

  describe("list", () => {
    it("should list files in directory", async () => {
      await store.write("file1.txt", "content1");
      await store.write("file2.txt", "content2");
      const files = await store.list("");
      expect(files).toHaveLength(2);
      expect(files.map(f => f.name)).toContain("file1.txt");
      expect(files.map(f => f.name)).toContain("file2.txt");
    });
  });

  describe("path traversal", () => {
    it("should prevent path traversal attacks", async () => {
      await expect(
        store.write("../outside.txt", "content")
      ).rejects.toThrow(StorageError);
    });
  });
});
