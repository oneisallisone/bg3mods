import { createMod } from '../lib/modUtils';
import { Mod } from '../types';

async function createInitialMod() {
  const modLoader: Mod = {
    id: 'bg3-mod-loader',
    name: 'BG3 Mod Manager',
    description: 'Essential tool for managing Baldur\'s Gate 3 mods',
    category: 'prerequisites',
    version: '1.0.0',
    author: {
      name: 'BG3 Community',
      url: 'https://github.com/bg3-community'
    },
    images: [],
    videos: [],
    downloadUrl: 'https://github.com/bg3-community/bg3-mod-manager/releases',
    lastUpdated: new Date().toISOString(),
    downloads: 0,
    rating: 5,
    featured: true,
    tags: ['tool', 'essential', 'manager'],
    requirements: [],
    features: [
      'Easy mod installation',
      'Mod conflict detection',
      'Load order management',
      'Profile support'
    ]
  };

  try {
    await createMod(modLoader);
    console.log('Initial mod created successfully');
  } catch (error) {
    console.error('Failed to create initial mod:', error);
  }
}

createInitialMod().catch(console.error);
