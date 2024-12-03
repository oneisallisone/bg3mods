export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface ModImage {
  url: string;
  caption?: string;
}

export interface ModVideo {
  url: string;
  title?: string;
  platform?: 'youtube' | 'bilibili' | 'other';
}

export interface ModRequirement {
  name: string;
  url?: string;
  description?: string;
}

export interface Mod {
  id: string;
  name: string;
  description: string;
  category: string;
  author_name: string;
  author_url?: string;
  downloads: number;
  rating: number;
  version: string;
  last_updated: string;
  download_url: string;
  requirements: ModRequirement[];
  features: string[];
  tags: string[];
  images: ModImage[];
  videos: ModVideo[];
}

export interface Background {
  id: string;
  url: string;
  filename: string;
  size: number;
  width?: number;
  height?: number;
  uploaded_at: string;
  mime_type: string;
  active: boolean;
  originalFormat?: string;
}
