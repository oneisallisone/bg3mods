import { Post, PostMetadata } from "../../types/content";

export interface IContentParser {
  /**
   * Parse content and extract metadata
   */
  parse(content: string): Promise<{
    metadata: PostMetadata;
    content: string;
  }>;

  /**
   * Serialize post to string format
   */
  serialize(post: Post): Promise<string>;

  /**
   * Validate post metadata
   */
  validateMetadata(metadata: PostMetadata): Promise<void>;

  /**
   * Calculate reading time for content
   */
  calculateReadingTime(content: string): number;
}
