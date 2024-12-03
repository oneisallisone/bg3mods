import { Mod, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'prerequisites',
    name: 'Prerequisites & Tools',
    description: 'Essential tools and requirements for modding BG3',
    icon: 'tools',
    count: 0
  },
  {
    id: 'ui',
    name: 'UI Optimization',
    description: 'Enhance and customize the game interface',
    icon: 'monitor',
    count: 0
  },
  {
    id: 'gameplay',
    name: 'Gameplay Enhancements',
    description: 'Modify and improve core gameplay mechanics',
    icon: 'gamepad',
    count: 0
  }
];

export const sampleMods: Mod[] = [
  {
    id: 'native-mod-loader',
    name: 'Native Mod Loader',
    description: 'Essential mod loader for BG3',
    category: 'prerequisites',
    author_name: 'LaughingLeader',
    author_url: 'https://github.com/LaughingLeader',
    downloads: 2500000,
    rating: 5.0,
    version: '1.1.0',
    last_updated: '2024-01-05',
    requirements: [],
    download_url: 'https://github.com/LaughingLeader/BG3ModManager/releases/latest',
    features: [
      'Mod conflict detection',
      'Native mod support without .pak file replacement',
      'Automatic load order management',
      'One-click installation',
      'Backup management'
    ],
    tags: ['essential', 'tool', 'mod manager'],
    images: [],
    videos: []
  }
];

export const mods = sampleMods;

// Update category counts
categories.forEach(category => {
  category.count = sampleMods.filter(mod => mod.category === category.id).length;
});
