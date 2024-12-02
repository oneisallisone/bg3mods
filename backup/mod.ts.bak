export interface ModAuthor {
  name: string;
  url?: string;
}

export interface ModImage {
  url: string;
  caption: string;
}

export interface ModVideo {
  url: string;
  title: string;
  platform: 'youtube' | 'bilibili' | 'other';
}

export interface ModRequirement {
  name: string;
  url: string;
  description?: string;
}

export interface Mod {
  id: string;
  name: string;
  description: string;
  category: string;
  author: ModAuthor;
  downloads: number;
  rating: number;
  version: string;
  lastUpdated: string;
  requirements: ModRequirement[];
  installGuide?: string;
  downloadUrl: string;
  features: string[];
  tags: string[];
  images: ModImage[];
  videos: ModVideo[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

// 为了保持向后兼容
export type ModCategory =
  | "prerequisites"
  | "ui"
  | "gameplay"
  | "graphics"
  | "audio"
  | "utility"
  | "fixes";

export type CategoryInfo = Category;
