import { Mod, ModCategory } from '../types/mod';
import { sampleMods } from '../data/mods';

export const getAllCategories = () => {
  return [
    {
      id: 'prerequisites',
      name: 'Prerequisites & Tools',
      description: 'Essential tools and requirements for modding'
    },
    {
      id: 'ui',
      name: 'UI Optimization',
      description: 'Enhance and customize the game interface'
    },
    {
      id: 'gameplay',
      name: 'Gameplay Enhancements',
      description: 'Modify and improve core gameplay mechanics'
    },
    {
      id: 'appearance',
      name: 'Character Appearance',
      description: 'Customize character looks and animations'
    },
    {
      id: 'equipment',
      name: 'Equipment & Items',
      description: 'New items, weapons, and armor'
    },
    {
      id: 'dice',
      name: 'Dice & RNG',
      description: 'Modify dice rolling and random number generation'
    },
    {
      id: 'balance',
      name: 'Game Balance',
      description: 'Adjust game difficulty and mechanics'
    },
    {
      id: 'class',
      name: 'Classes & Spells',
      description: 'New classes, subclasses, and spells'
    },
    {
      id: 'modifiers',
      name: 'Game Modifiers',
      description: 'Various game modifications and tweaks'
    }
  ];
};

export const getModsByCategory = (category: ModCategory | 'all'): Mod[] => {
  if (category === 'all') {
    return sampleMods;
  }
  return sampleMods.filter(mod => mod.category === category);
};

export const getLatestMods = (limit: number = 6): Mod[] => {
  return [...sampleMods]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
};

export const getPopularMods = (limit: number = 6): Mod[] => {
  return [...sampleMods]
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, limit);
};

export const searchMods = (query: string): Mod[] => {
  const searchTerm = query.toLowerCase();
  return sampleMods.filter(mod => 
    mod.name.toLowerCase().includes(searchTerm) ||
    mod.description.toLowerCase().includes(searchTerm) ||
    mod.author.name.toLowerCase().includes(searchTerm)
  );
};

export function getModById(modId: string): Mod | undefined {
  return sampleMods.find(mod => mod.id === modId);
}

export function getCategoryInfo(categoryId: ModCategory): any {
  return getAllCategories().find(cat => cat.id === categoryId);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getCompatibleMods(modId: string): Mod[] {
  // In a real implementation, this would check compatibility data
  // For now, return all mods except the current one
  return sampleMods.filter(mod => mod.id !== modId);
}

export function getHighestRatedMods(limit: number = 5): Mod[] {
  return [...sampleMods]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
