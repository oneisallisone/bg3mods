import { createMod } from '../lib/modUtils';
import { Mod } from '../types/mod';

async function createInitialMod() {
  const modLoader: Mod = {
    id: "native-mod-loader",
    name: "Native Mod Loader",
    description: "Essential mod loader for BG3",
    category: "prerequisites",
    author: {
      name: "Mod Team",
      url: "https://example.com/author"
    },
    downloads: 150000,
    rating: 4.9,
    version: "1.2.0",
    lastUpdated: "2024-01-15",
    requirements: [],
    downloadUrl: "https://example.com/download/native-mod-loader",
    features: [
      "Easy mod installation",
      "Mod conflict detection",
      "Load order management"
    ],
    tags: ["essential", "tool", "loader"],
    images: [],
    videos: []
  };

  try {
    console.log('Creating Native Mod Loader...');
    const createdMod = await createMod(modLoader);
    console.log('✅ Mod created successfully:');
    console.log(JSON.stringify(createdMod, null, 2));
  } catch (error) {
    console.error('Failed to create mod:', error);
  }
}

createInitialMod();
