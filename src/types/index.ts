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
  nexusId?: string;
  version: string;
  author: ModAuthor;
  images: ModImage[];
  downloadUrl: string;
  size?: string;
  lastUpdated: string;
  downloads: number;
  rating: number;
  featured?: boolean;
  tags: string[];
  requirements: ModRequirement[];
  installGuide?: string;
  features: string[];
  videos: ModVideo[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface Background {
  id: string;
  url: string;
  active: boolean;
  isLocal: boolean;
  originalFormat?: string;
  width?: number;
  height?: number;
  size?: number;
}
