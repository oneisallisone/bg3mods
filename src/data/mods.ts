import { Mod, CategoryInfo } from '../types/mod';

export const categories: CategoryInfo[] = [
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
  },
  {
    id: 'appearance',
    name: 'Character Appearance',
    description: 'Customize character looks and animations',
    icon: 'user',
    count: 0
  },
  {
    id: 'equipment',
    name: 'Equipment & Items',
    description: 'New items, weapons, and armor',
    icon: 'sword',
    count: 0
  },
  {
    id: 'dice',
    name: 'Dice & RNG',
    description: 'Modify dice rolling and random number generation',
    icon: 'dice',
    count: 0
  },
  {
    id: 'balance',
    name: 'Game Balance',
    description: 'Adjust game difficulty and mechanics',
    icon: 'scale',
    count: 0
  },
  {
    id: 'class',
    name: 'Classes & Spells',
    description: 'New classes, subclasses, and spells',
    icon: 'wand',
    count: 0
  },
  {
    id: 'modifiers',
    name: 'Game Modifiers',
    description: 'Various game modifications and tweaks',
    icon: 'settings',
    count: 0
  },
  {
    id: 'achievement',
    name: 'Achievements',
    description: 'Achievement tracking and customization',
    icon: 'trophy',
    count: 0
  },
  {
    id: 'combat',
    name: 'Combat',
    description: 'Combat mechanics and enhancements',
    icon: 'crossed-swords',
    count: 0
  },
  {
    id: 'level',
    name: 'Level',
    description: 'Leveling system and progression',
    icon: 'level',
    count: 0
  },
  {
    id: 'graphics',
    name: 'Graphics',
    description: 'Visual enhancements and graphics mods',
    icon: 'palette',
    count: 0
  }
];

export const sampleMods: Mod[] = [
  // Prerequisites & Tools
  {
    id: 'native-mod-loader',
    name: 'Native Mod Loader',
    description: 'Essential mod loader for BG3',
    category: 'prerequisites',
    author: { name: 'LaughingLeader', url: 'https://github.com/LaughingLeader' },
    downloads: 2500000,
    rating: 5.0,
    version: '1.1.0',
    lastUpdated: '2024-01-05',
    requirements: [],
    installGuide: 'Extract to game root directory. Run BG3ModManager.exe as administrator.',
    downloadUrl: 'https://github.com/LaughingLeader/BG3ModManager/releases/latest',
    features: [
      'Mod conflict detection',
      'Native mod support without .pak file replacement',
      'Automatic load order management',
      'One-click installation',
      'Backup management'
    ],
    tags: ['essential', 'tool', 'mod manager']
  },
  {
    id: 'improvedui-ready',
    name: 'ImprovedUI ReleaseReady',
    description: 'Required framework for ImprovedUI mod',
    category: 'prerequisites',
    author: { name: 'ShinyHobo', url: 'https://www.nexusmods.com/baldursgate3/users/123857934' },
    downloads: 850000,
    rating: 4.9,
    version: '2.2.1',
    lastUpdated: '2024-01-10',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Load before ImprovedUI.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/13',
    features: [
      'Core UI framework',
      'Performance optimization',
      'Memory management',
      'UI element caching'
    ],
    tags: ['ui', 'requirement', 'framework']
  },
  {
    id: 'bg3-mod-fixer',
    name: 'BG3 Mod Fixer',
    description: 'Utility tool for fixing common mod issues',
    category: 'prerequisites',
    author: { name: 'ModFixer', url: 'https://www.nexusmods.com/baldursgate3/users/345678' },
    downloads: 450000,
    rating: 4.7,
    version: '1.3.0',
    lastUpdated: '2024-01-18',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Run when encountering issues.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/141',
    features: [
      'Automatic issue detection',
      'Conflict resolution',
      'Mod cleanup',
      'Performance fixes'
    ],
    tags: ['tool', 'utility', 'fixes']
  },

  // UI Optimization
  {
    id: 'better-inventory',
    name: 'Better Inventory',
    description: 'Enhanced inventory management system',
    category: 'ui',
    author: { name: 'InventoryPro', url: 'https://www.nexusmods.com/baldursgate3/users/456789' },
    downloads: 420000,
    rating: 4.8,
    version: '2.1.0',
    lastUpdated: '2024-01-19',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure sorting options in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/193',
    features: [
      'Advanced sorting',
      'Custom categories',
      'Search function',
      'Auto-organization'
    ],
    tags: ['inventory', 'ui', 'organization']
  },
  {
    id: 'improved-tooltips',
    name: 'Improved World Tooltips',
    description: 'Enhanced tooltip system with detailed information',
    category: 'ui',
    author: { name: 'TooltipMaster', url: 'https://www.nexusmods.com/baldursgate3/users/567890' },
    downloads: 75800,
    rating: 4.7,
    version: '1.4.0',
    lastUpdated: '2024-01-18',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Customize tooltip settings in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/265',
    features: [
      'Enhanced tooltips',
      'Item details',
      'Interactive elements',
      'Custom formatting'
    ],
    tags: ['tooltips', 'ui', 'information']
  },
  {
    id: 'improved-ui',
    name: 'ImprovedUI',
    description: 'Complete UI overhaul with enhanced visuals',
    category: 'ui',
    author: { name: 'ShinyHobo', url: 'https://www.nexusmods.com/baldursgate3/users/234567' },
    downloads: 5000000,
    rating: 4.9,
    version: '3.0.0',
    lastUpdated: '2024-01-20',
    requirements: ['native-mod-loader', 'improved-ui-ready'],
    installGuide: 'Install using Native Mod Manager after ImprovedUI ReleaseReady.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/12',
    features: [
      'Enhanced UI layout',
      'Better inventory',
      'Improved combat interface',
      'Custom themes'
    ],
    tags: ['ui', 'interface', 'quality-of-life']
  },

  // Gameplay Enhancements
  {
    id: 'camera-tweaks',
    name: 'Native Camera Tweaks',
    description: 'Enhanced camera controls with advanced features',
    category: 'gameplay',
    author: { name: 'CameraPro', url: 'https://www.nexusmods.com/baldursgate3/users/789012' },
    downloads: 520000,
    rating: 4.7,
    version: '1.5.0',
    lastUpdated: '2024-01-16',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure camera settings in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/374',
    features: [
      'Enhanced zoom',
      'Better angles',
      'Smooth transitions',
      'Custom presets'
    ],
    tags: ['camera', 'controls', 'quality-of-life']
  },
  {
    id: 'magic-overhaul',
    name: 'Magic Overhaul',
    description: 'Comprehensive magic system enhancement',
    category: 'gameplay',
    author: { name: 'SpellMaster', url: 'https://www.nexusmods.com/baldursgate3/users/890123' },
    downloads: 480000,
    rating: 4.8,
    version: '2.2.0',
    lastUpdated: '2024-01-15',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New spells will be available in character creation.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/389',
    features: [
      'New spells',
      'Enhanced effects',
      'Balance adjustments',
      'Custom animations'
    ],
    tags: ['magic', 'spells', 'gameplay']
  },
  {
    id: 'native-camera-tweaks',
    name: 'Native Camera Tweaks',
    description: 'Comprehensive camera control enhancement with advanced options for zoom, rotation, tilt, and movement. Includes combat camera improvements and cinematic features.',
    category: 'gameplay',
    author: { name: 'CameraPro', url: 'https://www.nexusmods.com/baldursgate3/users/135790' },
    downloads: 410000,
    rating: 4.8,
    version: '2.2.0',
    lastUpdated: '2024-01-15',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure in-game using F7 key.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/284',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/284',
    screenshots: [
      {
        url: '/images/mods/native-camera-tweaks/camera.jpg',
        thumbnailUrl: '/images/mods/native-camera-tweaks/camera-thumb.jpg',
        caption: 'Enhanced Camera Controls'
      }
    ],
    features: [
      'Advanced zoom controls',
      'Rotation enhancement',
      'Tilt adjustment',
      'Combat camera options',
      'Cinematic features',
      'Custom presets'
    ],
    tags: ['camera', 'quality of life', 'essential', 'most endorsed']
  },
  {
    id: 'magic-overhaul',
    name: 'Magic Overhaul',
    description: 'Complete overhaul of the magic system with new spells, effects, and mechanics. Includes rebalanced magic schools, new casting animations, and enhanced visual effects.',
    category: 'gameplay',
    author: { name: 'SpellMaster', url: 'https://www.nexusmods.com/baldursgate3/users/468135' },
    downloads: 280000,
    rating: 4.5,
    version: '3.1.0',
    lastUpdated: '2024-01-12',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Recommended to start a new game.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/286',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/286',
    screenshots: [
      {
        url: '/images/mods/magic-overhaul/spells.jpg',
        thumbnailUrl: '/images/mods/magic-overhaul/spells-thumb.jpg',
        caption: 'New Spell Effects'
      }
    ],
    features: [
      'New spell effects',
      'Rebalanced magic schools',
      'Enhanced casting animations',
      'Custom visual effects',
      'Spell combination system',
      'Magic crafting features'
    ],
    tags: ['magic', 'overhaul', 'gameplay', 'spells']
  },

  // Character Appearance
  {
    id: 'enhanced-visuals',
    name: 'Enhanced Visuals',
    description: 'Comprehensive visual enhancement suite',
    category: 'graphics',
    author: { name: 'VisualPro', url: 'https://www.nexusmods.com/baldursgate3/users/890123' },
    downloads: 680000,
    rating: 4.8,
    version: '2.6.0',
    lastUpdated: '2024-01-06',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure visual settings in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/156',
    features: [
      'Enhanced textures',
      'Improved lighting',
      'Better effects',
      'Custom shaders'
    ],
    tags: ['graphics', 'visuals', 'enhancement']
  },
  {
    id: 'character-customization-pack',
    name: 'Character Customization Pack',
    description: 'Massive collection of new character customization options including hairstyles, faces, body types, and accessories. Features high-quality assets and lore-friendly designs.',
    category: 'appearance',
    author: { name: 'CustomMaster', url: 'https://www.nexusmods.com/baldursgate3/users/684321' },
    downloads: 380000,
    rating: 4.7,
    version: '3.0.0',
    lastUpdated: '2024-01-13',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New options available in character creation.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/282',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/282',
    screenshots: [
      {
        url: '/images/mods/character-customization-pack/options.jpg',
        thumbnailUrl: '/images/mods/character-customization-pack/options-thumb.jpg',
        caption: 'New Customization Options'
      }
    ],
    features: [
      'New hairstyles',
      'Additional face options',
      'Body type variations',
      'Custom accessories',
      'Lore-friendly designs',
      'High-quality textures'
    ],
    tags: ['customization', 'character', 'appearance', 'creation']
  },
  {
    id: 'vibrant-colors',
    name: 'Vibrant Colors',
    description: 'Enhanced color palette system that brings more vibrant and diverse colors to characters and equipment. Includes custom color wheels and preset collections.',
    category: 'appearance',
    author: { name: 'ColorMaster', url: 'https://www.nexusmods.com/baldursgate3/users/753951' },
    downloads: 250000,
    rating: 4.6,
    version: '1.8.0',
    lastUpdated: '2024-01-11',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Access new colors in character creation and dye system.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/290',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/290',
    screenshots: [
      {
        url: '/images/mods/vibrant-colors/palette.jpg',
        thumbnailUrl: '/images/mods/vibrant-colors/palette-thumb.jpg',
        caption: 'Enhanced Color Palette'
      }
    ],
    features: [
      'Extended color palette',
      'Custom color wheel',
      'Preset collections',
      'Dynamic color system',
      'Equipment dye options',
      'Material enhancement'
    ],
    tags: ['colors', 'visuals', 'customization', 'appearance']
  },

  // Equipment & Items
  {
    id: 'basket-full-of-equipment',
    name: 'Basket Full of Equipment',
    description: 'Massive equipment expansion adding over 400 new items including weapons, armor, accessories, and magical items. Features unique designs and balanced stats.',
    category: 'equipment',
    author: { name: 'EquipMaster', url: 'https://www.nexusmods.com/baldursgate3/users/864213' },
    downloads: 390000,
    rating: 4.8,
    version: '3.2.0',
    lastUpdated: '2024-01-15',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New items available from merchants and loot.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/291',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/291',
    screenshots: [
      {
        url: '/images/mods/basket-full-of-equipment/showcase.jpg',
        thumbnailUrl: '/images/mods/basket-full-of-equipment/showcase-thumb.jpg',
        caption: 'New Equipment Showcase'
      }
    ],
    features: [
      '400+ new items',
      'Balanced stats',
      'Unique designs',
      'New magical effects',
      'Custom item sets',
      'Merchant integration'
    ],
    tags: ['equipment', 'items', 'weapons', 'armor']
  },
  {
    id: 'ultimate-equipment-pack',
    name: 'Ultimate Equipment Pack',
    description: 'Comprehensive equipment collection featuring unique weapons, armor sets, and magical items. Includes new enchantments and special effects.',
    category: 'equipment',
    author: { name: 'UltimateMod', url: 'https://www.nexusmods.com/baldursgate3/users/957342' },
    downloads: 320000,
    rating: 4.7,
    version: '2.3.0',
    lastUpdated: '2024-01-12',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Compatible with other equipment mods.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/292',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/292',
    screenshots: [
      {
        url: '/images/mods/ultimate-equipment-pack/items.jpg',
        thumbnailUrl: '/images/mods/ultimate-equipment-pack/items-thumb.jpg',
        caption: 'Equipment Collection'
      }
    ],
    features: [
      'Unique weapon designs',
      'Complete armor sets',
      'New enchantments',
      'Special effects',
      'Custom animations',
      'Balanced gameplay'
    ],
    tags: ['equipment', 'weapons', 'armor', 'magic']
  },
  {
    id: 'modular-equipment',
    name: 'Modular Equipment',
    description: 'Witcher-inspired modular equipment system allowing for weapon and armor customization. Features upgrade paths and unique enhancement options.',
    category: 'equipment',
    author: { name: 'WitcherFan', url: 'https://www.nexusmods.com/baldursgate3/users/846123' },
    downloads: 280000,
    rating: 4.6,
    version: '1.8.0',
    lastUpdated: '2024-01-10',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Access crafting at blacksmiths.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/293',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/293',
    screenshots: [
      {
        url: '/images/mods/modular-equipment/crafting.jpg',
        thumbnailUrl: '/images/mods/modular-equipment/crafting-thumb.jpg',
        caption: 'Modular Crafting System'
      }
    ],
    features: [
      'Witcher-style upgrades',
      'Modular components',
      'Custom enhancements',
      'Crafting system',
      'Progressive upgrades',
      'Visual customization'
    ],
    tags: ['equipment', 'witcher', 'crafting', 'customization']
  },

  // Dice & RNG
  {
    id: 'custom-dice',
    name: 'Custom Dice',
    description: 'Comprehensive dice customization system with beautiful visual effects, custom animations, and themed dice sets. Includes high-quality 3D models and particle effects.',
    category: 'dice',
    author: { name: 'DiceMaster', url: 'https://www.nexusmods.com/baldursgate3/users/735124' },
    downloads: 72000,
    rating: 4.7,
    version: '2.1.0',
    lastUpdated: '2024-01-14',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure dice in game settings.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/294',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/294',
    screenshots: [
      {
        url: '/images/mods/custom-dice/showcase.jpg',
        thumbnailUrl: '/images/mods/custom-dice/showcase-thumb.jpg',
        caption: 'Custom Dice Sets'
      }
    ],
    features: [
      'Custom dice models',
      'Themed dice sets',
      'Rolling animations',
      'Particle effects',
      'Sound effects',
      'Material options'
    ],
    tags: ['dice', 'customization', 'visual', 'animation']
  },
  {
    id: 'better-target-info',
    name: 'Better Target Info',
    description: 'Enhanced target information display during dice rolls, showing detailed modifiers, advantages, and potential outcomes. Features customizable UI elements.',
    category: 'dice',
    author: { name: 'InfoWizard', url: 'https://www.nexusmods.com/baldursgate3/users/624513' },
    downloads: 65000,
    rating: 4.6,
    version: '1.4.0',
    lastUpdated: '2024-01-11',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Customize display in mod settings.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/295',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/295',
    screenshots: [
      {
        url: '/images/mods/better-target-info/interface.jpg',
        thumbnailUrl: '/images/mods/better-target-info/interface-thumb.jpg',
        caption: 'Enhanced Target Display'
      }
    ],
    features: [
      'Detailed modifiers',
      'Advantage indicators',
      'Outcome previews',
      'Customizable UI',
      'Roll history',
      'Statistical analysis'
    ],
    tags: ['dice', 'information', 'ui', 'combat']
  },
  {
    id: 'clear-dice',
    name: 'Clear Dice',
    description: 'Improves dice roll visibility with enhanced visual clarity, better camera angles, and slow-motion options. Perfect for following important rolls.',
    category: 'dice',
    author: { name: 'ClearView', url: 'https://www.nexusmods.com/baldursgate3/users/513642' },
    downloads: 58000,
    rating: 4.6,
    version: '1.2.0',
    lastUpdated: '2024-01-09',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure visibility options in-game.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/296',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/296',
    screenshots: [
      {
        url: '/images/mods/clear-dice/visibility.jpg',
        thumbnailUrl: '/images/mods/clear-dice/visibility-thumb.jpg',
        caption: 'Enhanced Dice Visibility'
      }
    ],
    features: [
      'Enhanced visibility',
      'Camera improvements',
      'Slow-motion options',
      'Color highlights',
      'Roll tracking',
      'Custom animations'
    ],
    tags: ['dice', 'visibility', 'quality of life', 'animation']
  },

  // Game Balance
  {
    id: 'choose-your-stats',
    name: 'Choose Your Stats',
    description: 'Advanced character statistics customization system allowing full control over ability scores, skills, and progression. Features balanced presets and custom configurations.',
    category: 'balance',
    author: { name: 'StatMaster', url: 'https://www.nexusmods.com/baldursgate3/users/824513' },
    downloads: 260000,
    rating: 4.7,
    version: '2.2.0',
    lastUpdated: '2024-01-15',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure stats in character creation.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/297',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/297',
    screenshots: [
      {
        url: '/images/mods/choose-your-stats/interface.jpg',
        thumbnailUrl: '/images/mods/choose-your-stats/interface-thumb.jpg',
        caption: 'Stats Configuration Interface'
      }
    ],
    features: [
      'Custom ability scores',
      'Skill point allocation',
      'Progression options',
      'Balanced presets',
      'Multiclass support',
      'Stat templates'
    ],
    tags: ['stats', 'balance', 'customization', 'character']
  },
  {
    id: 'combat-extender',
    name: 'Combat Extender',
    description: 'Enhances combat mechanics with new actions, reactions, and tactical options. Includes advanced AI improvements and combat customization features.',
    category: 'balance',
    author: { name: 'CombatPro', url: 'https://www.nexusmods.com/baldursgate3/users/913624' },
    downloads: 240000,
    rating: 4.6,
    version: '1.7.0',
    lastUpdated: '2024-01-13',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure combat options in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/298',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/298',
    screenshots: [
      {
        url: '/images/mods/combat-extender/combat.jpg',
        thumbnailUrl: '/images/mods/combat-extender/combat-thumb.jpg',
        caption: 'Enhanced Combat Options'
      }
    ],
    features: [
      'New combat actions',
      'Enhanced reactions',
      'Tactical options',
      'AI improvements',
      'Combat customization',
      'Balance tweaks'
    ],
    tags: ['combat', 'mechanics', 'balance', 'ai']
  },
  {
    id: 'many-more-monsters',
    name: 'Many More Monsters',
    description: 'Expands the monster variety with new creatures, enhanced AI behaviors, and balanced encounter designs. Features lore-friendly additions and custom animations.',
    category: 'balance',
    author: { name: 'MonsterMaker', url: 'https://www.nexusmods.com/baldursgate3/users/735912' },
    downloads: 220000,
    rating: 4.5,
    version: '2.3.0',
    lastUpdated: '2024-01-11',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New monsters appear in appropriate areas.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/299',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/299',
    screenshots: [
      {
        url: '/images/mods/many-more-monsters/showcase.jpg',
        thumbnailUrl: '/images/mods/many-more-monsters/showcase-thumb.jpg',
        caption: 'New Monster Showcase'
      }
    ],
    features: [
      'New monster types',
      'Enhanced AI behaviors',
      'Balanced encounters',
      'Custom animations',
      'Lore integration',
      'Difficulty options'
    ],
    tags: ['monsters', 'combat', 'balance', 'content']
  },

  // Classes & Spells
  {
    id: 'expanded-classes',
    name: 'Expanded Classes',
    description: 'Adds new playable classes with unique abilities, spells, and progression paths. Features carefully balanced content and lore-friendly integration.',
    category: 'class',
    author: { name: 'ClassMaster', url: 'https://www.nexusmods.com/baldursgate3/users/824513' },
    downloads: 380000,
    rating: 4.8,
    version: '2.4.0',
    lastUpdated: '2024-01-16',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New classes available in character creation.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/300',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/300',
    screenshots: [
      {
        url: '/images/mods/expanded-classes/showcase.jpg',
        thumbnailUrl: '/images/mods/expanded-classes/showcase-thumb.jpg',
        caption: 'New Class Selection'
      }
    ],
    features: [
      'New playable classes',
      'Unique abilities',
      'Custom spells',
      'Progression paths',
      'Class-specific quests',
      'Balance tweaks'
    ],
    tags: ['classes', 'spells', 'content', 'gameplay']
  },
  {
    id: 'spell-master',
    name: 'Spell Master',
    description: 'Comprehensive spell system overhaul with new spells, enhanced effects, and improved casting mechanics. Includes visual upgrades and balanced magic progression.',
    category: 'class',
    author: { name: 'SpellForge', url: 'https://www.nexusmods.com/baldursgate3/users/913624' },
    downloads: 350000,
    rating: 4.7,
    version: '2.1.0',
    lastUpdated: '2024-01-14',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New spells available in spellbooks.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/301',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/301',
    screenshots: [
      {
        url: '/images/mods/spell-master/effects.jpg',
        thumbnailUrl: '/images/mods/spell-master/effects-thumb.jpg',
        caption: 'Enhanced Spell Effects'
      }
    ],
    features: [
      'New spells',
      'Enhanced effects',
      'Improved mechanics',
      'Visual upgrades',
      'Balanced progression',
      'School specialization'
    ],
    tags: ['spells', 'magic', 'effects', 'gameplay']
  },
  {
    id: 'subclass-plus',
    name: 'Subclass Plus',
    description: 'Expands subclass options for all base classes with unique features, abilities, and progression paths. Includes detailed documentation and balanced gameplay.',
    category: 'class',
    author: { name: 'SubclassPro', url: 'https://www.nexusmods.com/baldursgate3/users/735912' },
    downloads: 320000,
    rating: 4.6,
    version: '1.8.0',
    lastUpdated: '2024-01-12',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New subclasses available during level up.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/302',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/302',
    screenshots: [
      {
        url: '/images/mods/subclass-plus/selection.jpg',
        thumbnailUrl: '/images/mods/subclass-plus/selection-thumb.jpg',
        caption: 'Subclass Selection Interface'
      }
    ],
    features: [
      'New subclasses',
      'Unique features',
      'Custom abilities',
      'Progression paths',
      'Documentation',
      'Balance testing'
    ],
    tags: ['classes', 'subclasses', 'content', 'progression']
  },

  // Game Modifiers
  {
    id: 'game-speed-control',
    name: 'Game Speed Control',
    description: 'Advanced game speed modification system with customizable presets, hotkeys, and smooth transitions. Perfect for both combat and exploration.',
    category: 'modifiers',
    author: { name: 'SpeedMaster', url: 'https://www.nexusmods.com/baldursgate3/users/824513' },
    downloads: 420000,
    rating: 4.8,
    version: '2.5.0',
    lastUpdated: '2024-01-17',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure speed settings in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/303',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/303',
    screenshots: [
      {
        url: '/images/mods/game-speed-control/interface.jpg',
        thumbnailUrl: '/images/mods/game-speed-control/interface-thumb.jpg',
        caption: 'Speed Control Interface'
      }
    ],
    features: [
      'Variable speed control',
      'Custom presets',
      'Hotkey support',
      'Smooth transitions',
      'Combat integration',
      'Performance optimization'
    ],
    tags: ['speed', 'gameplay', 'utility', 'control']
  },
  {
    id: 'difficulty-tweaks',
    name: 'Difficulty Tweaks',
    description: 'Comprehensive difficulty customization with fine-tuned parameters for combat, resources, and game mechanics. Includes presets and custom configuration options.',
    category: 'modifiers',
    author: { name: 'DifficultyPro', url: 'https://www.nexusmods.com/baldursgate3/users/913624' },
    downloads: 380000,
    rating: 4.7,
    version: '2.2.0',
    lastUpdated: '2024-01-15',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Adjust difficulty settings in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/304',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/304',
    screenshots: [
      {
        url: '/images/mods/difficulty-tweaks/settings.jpg',
        thumbnailUrl: '/images/mods/difficulty-tweaks/settings-thumb.jpg',
        caption: 'Difficulty Settings'
      }
    ],
    features: [
      'Custom difficulty levels',
      'Combat parameters',
      'Resource management',
      'AI behavior',
      'Preset configurations',
      'Dynamic scaling'
    ],
    tags: ['difficulty', 'balance', 'gameplay', 'customization']
  },
  {
    id: 'resource-manager',
    name: 'Resource Manager',
    description: 'Advanced resource management system for controlling item availability, spell slots, and character resources. Features detailed monitoring and customization options.',
    category: 'modifiers',
    author: { name: 'ResourceWizard', url: 'https://www.nexusmods.com/baldursgate3/users/735912' },
    downloads: 340000,
    rating: 4.6,
    version: '1.9.0',
    lastUpdated: '2024-01-13',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure resource settings in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/305',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/305',
    screenshots: [
      {
        url: '/images/mods/resource-manager/dashboard.jpg',
        thumbnailUrl: '/images/mods/resource-manager/dashboard-thumb.jpg',
        caption: 'Resource Management Dashboard'
      }
    ],
    features: [
      'Resource monitoring',
      'Custom limits',
      'Spell slot management',
      'Item availability',
      'Usage tracking',
      'Balance options'
    ],
    tags: ['resources', 'management', 'gameplay', 'utility']
  },
  {
    id: 'achievement-enabler',
    name: 'Achievement Enabler',
    description: 'Enables achievement tracking while using mods, featuring compatibility with all major mods and customizable achievement triggers. Includes detailed progress tracking.',
    category: 'achievement',
    author: { name: 'AchievePro', url: 'https://www.nexusmods.com/baldursgate3/users/824513' },
    downloads: 850000,
    rating: 4.9,
    version: '2.6.0',
    lastUpdated: '2024-01-18',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Achievements will be automatically enabled.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/306',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/306',
    screenshots: [
      {
        url: '/images/mods/achievement-enabler/interface.jpg',
        thumbnailUrl: '/images/mods/achievement-enabler/interface-thumb.jpg',
        caption: 'Achievement Tracking Interface'
      }
    ],
    features: [
      'Achievement compatibility',
      'Progress tracking',
      'Custom triggers',
      'Mod compatibility',
      'Statistics display',
      'Achievement history'
    ],
    tags: ['achievements', 'utility', 'compatibility', 'tracking']
  },
  {
    id: 'achievement-tracker',
    name: 'Achievement Tracker',
    description: 'Advanced achievement tracking system with detailed progress monitoring, custom notifications, and achievement guides. Features a beautiful interface and statistics.',
    category: 'achievement',
    author: { name: 'TrackMaster', url: 'https://www.nexusmods.com/baldursgate3/users/913624' },
    downloads: 680000,
    rating: 4.8,
    version: '2.3.0',
    lastUpdated: '2024-01-16',
    requirements: ['native-mod-loader', 'achievement-enabler'],
    installGuide: 'Install using Native Mod Manager. Configure tracking options in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/307',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/307',
    screenshots: [
      {
        url: '/images/mods/achievement-tracker/dashboard.jpg',
        thumbnailUrl: '/images/mods/achievement-tracker/dashboard-thumb.jpg',
        caption: 'Achievement Dashboard'
      }
    ],
    features: [
      'Progress monitoring',
      'Custom notifications',
      'Achievement guides',
      'Statistics display',
      'Tracking history',
      'Interface customization'
    ],
    tags: ['achievements', 'tracking', 'interface', 'guides']
  },
  {
    id: 'achievement-plus',
    name: 'Achievement Plus',
    description: 'Adds new custom achievements with unique challenges and rewards. Features lore-friendly content and integration with the base game achievement system.',
    category: 'achievement',
    author: { name: 'AchieveMaker', url: 'https://www.nexusmods.com/baldursgate3/users/735912' },
    downloads: 580000,
    rating: 4.7,
    version: '2.0.0',
    lastUpdated: '2024-01-14',
    requirements: ['native-mod-loader', 'achievement-enabler'],
    installGuide: 'Install using Native Mod Manager. New achievements will be available immediately.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/308',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/308',
    screenshots: [
      {
        url: '/images/mods/achievement-plus/showcase.jpg',
        thumbnailUrl: '/images/mods/achievement-plus/showcase-thumb.jpg',
        caption: 'New Achievements Showcase'
      }
    ],
    features: [
      'New achievements',
      'Custom challenges',
      'Reward system',
      'Progress tracking',
      'Lore integration',
      'Achievement guides'
    ],
    tags: ['achievements', 'content', 'challenges', 'rewards']
  },
  {
    id: 'damage-preview',
    name: 'Damage Preview',
    description: 'Advanced damage calculation and preview system with detailed breakdowns, resistances, and potential outcomes. Features customizable UI and combat statistics.',
    category: 'modifiers',
    author: { name: 'DamagePro', url: 'https://www.nexusmods.com/baldursgate3/users/824513' },
    downloads: 780000,
    rating: 4.8,
    version: '2.7.0',
    lastUpdated: '2024-01-19',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure display options in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/309',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/309',
    screenshots: [
      {
        url: '/images/mods/damage-preview/interface.jpg',
        thumbnailUrl: '/images/mods/damage-preview/interface-thumb.jpg',
        caption: 'Damage Preview Interface'
      }
    ],
    features: [
      'Damage calculation',
      'Resistance preview',
      'Outcome prediction',
      'Combat statistics',
      'UI customization',
      'Performance optimization'
    ],
    tags: ['combat', 'damage', 'interface', 'utility']
  },
  {
    id: 'combat-overhaul',
    name: 'Combat Overhaul',
    description: 'Comprehensive combat system enhancement with new mechanics, tactical options, and AI improvements. Features balanced gameplay adjustments and customization.',
    category: 'combat',
    author: { name: 'CombatMaster', url: 'https://www.nexusmods.com/baldursgate3/users/901234' },
    downloads: 720000,
    rating: 4.7,
    version: '2.4.0',
    lastUpdated: '2024-01-17',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure combat settings in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/401',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/401',
    screenshots: [
      {
        url: '/images/mods/combat-overhaul/showcase.jpg',
        thumbnailUrl: '/images/mods/combat-overhaul/showcase-thumb.jpg',
        caption: 'Combat System Showcase'
      }
    ],
    features: [
      'New mechanics',
      'Tactical options',
      'AI improvements',
      'Balance adjustments',
      'Combat customization',
      'Performance tweaks'
    ],
    tags: ['combat', 'mechanics', 'balance', 'ai']
  },
  {
    id: 'enhanced-merchants',
    name: 'Enhanced Merchants',
    description: 'Improves merchant inventories and trading mechanics.',
    category: 'gameplay',
    author: { name: 'MerchantPro', url: 'https://www.nexusmods.com/baldursgate3/users/123456' },
    downloads: 280000,
    rating: 4.7,
    version: '1.8.0',
    lastUpdated: '2024-01-13',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New merchant features will be available immediately.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/428',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/428',
    screenshots: [
      {
        url: '/images/mods/enhanced-merchants/settings.jpg',
        thumbnailUrl: '/images/mods/enhanced-merchants/settings-thumb.jpg',
        caption: 'Merchant Settings'
      }
    ],
    features: [
      'Expanded inventories',
      'Better prices',
      'New rare items',
      'Trading improvements'
    ],
    tags: ['merchants', 'economy', 'items']
  },
  {
    id: 'custom-classes',
    name: 'Custom Classes Pack',
    description: 'Adds new custom classes with unique abilities and features.',
    category: 'classes',
    author: { name: 'ClassMaster', url: 'https://www.nexusmods.com/baldursgate3/users/234567' },
    downloads: 420000,
    rating: 4.8,
    version: '2.5.0',
    lastUpdated: '2024-01-12',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New classes will be available in character creation.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/459',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/459',
    screenshots: [
      {
        url: '/images/mods/custom-classes/showcase.jpg',
        thumbnailUrl: '/images/mods/custom-classes/showcase-thumb.jpg',
        caption: 'New Class Showcase'
      }
    ],
    features: [
      'New classes',
      'Custom abilities',
      'Unique features',
      'Balance testing'
    ],
    tags: ['classes', 'gameplay', 'customization']
  },
  {
    id: 'combat-utilities',
    name: 'Combat Utilities',
    description: 'Essential combat utility tools including turn management, targeting assistance, and combat information display. Features quality of life improvements.',
    category: 'combat',
    author: { name: 'UtilityPro', url: 'https://www.nexusmods.com/baldursgate3/users/735912' },
    downloads: 680000,
    rating: 4.6,
    version: '2.1.0',
    lastUpdated: '2024-01-15',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Access utilities through combat interface.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/311',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/311',
    screenshots: [
      {
        url: '/images/mods/combat-utilities/tools.jpg',
        thumbnailUrl: '/images/mods/combat-utilities/tools-thumb.jpg',
        caption: 'Combat Utility Tools'
      }
    ],
    features: [
      'Turn management',
      'Targeting assistance',
      'Information display',
      'Combat tools',
      'Interface improvements',
      'Quality of life'
    ],
    tags: ['combat', 'utility', 'interface', 'tools']
  },
  {
    id: 'level-20-unlock',
    name: 'Level 20 Unlock',
    description: 'Comprehensive level cap expansion to 20 with balanced progression, new abilities, and epic-level content. Features carefully designed high-level encounters.',
    category: 'level',
    author: { name: 'LevelMaster', url: 'https://www.nexusmods.com/baldursgate3/users/824513' },
    downloads: 920000,
    rating: 4.9,
    version: '2.8.0',
    lastUpdated: '2024-01-20',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New levels available immediately.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/312',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/312',
    screenshots: [
      {
        url: '/images/mods/level-20-unlock/showcase.jpg',
        thumbnailUrl: '/images/mods/level-20-unlock/showcase-thumb.jpg',
        caption: 'Level 20 Content Showcase'
      }
    ],
    features: [
      'Level cap increase',
      'New abilities',
      'Epic content',
      'Balanced progression',
      'High-level encounters',
      'Performance optimization'
    ],
    tags: ['level', 'progression', 'content', 'balance']
  },
  {
    id: 'experience-tweaks',
    name: 'Experience Tweaks',
    description: 'Advanced experience point customization with adjustable rates, milestone options, and progression paths. Features detailed XP tracking and custom leveling.',
    category: 'level',
    author: { name: 'XPMaster', url: 'https://www.nexusmods.com/baldursgate3/users/913624' },
    downloads: 820000,
    rating: 4.8,
    version: '2.5.0',
    lastUpdated: '2024-01-18',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure XP settings in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/313',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/313',
    screenshots: [
      {
        url: '/images/mods/experience-tweaks/settings.jpg',
        thumbnailUrl: '/images/mods/experience-tweaks/settings-thumb.jpg',
        caption: 'XP Configuration Interface'
      }
    ],
    features: [
      'XP rate adjustment',
      'Milestone options',
      'Custom progression',
      'XP tracking',
      'Level scaling',
      'Balance options'
    ],
    tags: ['experience', 'progression', 'customization', 'balance']
  },
  {
    id: 'level-master',
    name: 'Level Master',
    description: 'Complete leveling system overhaul with custom progression paths, multiclass options, and prestige classes. Features detailed character development tools.',
    category: 'level',
    author: { name: 'ProgressionPro', url: 'https://www.nexusmods.com/baldursgate3/users/735912' },
    downloads: 780000,
    rating: 4.7,
    version: '2.2.0',
    lastUpdated: '2024-01-16',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Access leveling options in character screen.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/314',
    nexusUrl: 'https://www.nexusmods.com/baldursgate3/mods/314',
    screenshots: [
      {
        url: '/images/mods/level-master/interface.jpg',
        thumbnailUrl: '/images/mods/level-master/interface-thumb.jpg',
        caption: 'Leveling System Interface'
      }
    ],
    features: [
      'Custom progression',
      'Multiclass options',
      'Prestige classes',
      'Development tools',
      'Balance testing',
      'Performance optimization'
    ],
    tags: ['level', 'progression', 'classes', 'customization']
  },
  {
    id: 'combat-utilities',
    name: 'Combat Utilities',
    description: 'Essential combat utility tools and quality of life improvements.',
    category: 'combat',
    author: { name: 'CombatUtil', url: 'https://www.nexusmods.com/baldursgate3/users/345678' },
    downloads: 290000,
    rating: 4.6,
    version: '1.7.0',
    lastUpdated: '2024-01-11',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Configure utilities in mod menu.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/168',
    features: [
      'Combat utilities',
      'Turn management',
      'Target assistance',
      'Combat info display'
    ],
    tags: ['combat', 'utility', 'quality-of-life']
  },
  {
    id: 'achievement-enabler',
    name: 'Achievement Enabler',
    description: 'Enables achievements while using mods.',
    category: 'utility',
    author: { name: 'AchievePro', url: 'https://www.nexusmods.com/baldursgate3/users/456789' },
    downloads: 850000,
    rating: 5.0,
    version: '1.2.0',
    lastUpdated: '2024-01-10',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Achievements will be automatically enabled.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/206',
    features: [
      'Achievement support',
      'Mod compatibility',
      'No configuration needed'
    ],
    tags: ['achievements', 'utility', 'quality-of-life']
  },
  {
    id: 'enhanced-races',
    name: 'Enhanced Races',
    description: 'Adds new races and enhances existing ones with unique features.',
    category: 'races',
    author: { name: 'RaceMaster', url: 'https://www.nexusmods.com/baldursgate3/users/567890' },
    downloads: 380000,
    rating: 4.8,
    version: '2.1.0',
    lastUpdated: '2024-01-09',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New races available in character creation.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/243',
    features: [
      'New races',
      'Enhanced features',
      'Custom abilities',
      'Visual updates'
    ],
    tags: ['races', 'customization', 'gameplay']
  },
  {
    id: 'crafting-expanded',
    name: 'Crafting Expanded',
    description: 'Expands crafting system with new recipes and features.',
    category: 'gameplay',
    author: { name: 'CraftMaster', url: 'https://www.nexusmods.com/baldursgate3/users/678901' },
    downloads: 420000,
    rating: 4.7,
    version: '2.4.0',
    lastUpdated: '2024-01-08',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. New recipes available at crafting stations.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/287',
    features: [
      'New recipes',
      'Enhanced crafting',
      'Custom items',
      'Material system'
    ],
    tags: ['crafting', 'items', 'gameplay']
  },
  {
    id: 'enhanced-companions',
    name: 'Enhanced Companions',
    description: 'Improves companion interactions and features.',
    category: 'companions',
    author: { name: 'CompanionPro', url: 'https://www.nexusmods.com/baldursgate3/users/789012' },
    downloads: 520000,
    rating: 4.9,
    version: '2.2.0',
    lastUpdated: '2024-01-07',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Enhanced features available immediately.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/312',
    features: [
      'Enhanced dialogues',
      'New interactions',
      'Improved AI',
      'Custom events'
    ],
    tags: ['companions', 'story', 'gameplay']
  },
  {
    id: 'performance-optimizer',
    name: 'Performance Optimizer',
    description: 'Optimizes game performance while maintaining quality',
    category: 'utility',
    author: { name: 'OptimizePro', url: 'https://www.nexusmods.com/baldursgate3/users/901234' },
    downloads: 920000,
    rating: 4.9,
    version: '1.8.0',
    lastUpdated: '2024-01-05',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Performance improvements are automatic.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/183',
    features: [
      'Performance boost',
      'Memory optimization',
      'Loading improvements',
      'FPS stabilization'
    ],
    tags: ['performance', 'optimization', 'utility']
  },
  {
    id: 'bug-fixes',
    name: 'Community Bug Fixes',
    description: 'Collection of community-made bug fixes',
    category: 'fixes',
    author: { name: 'FixMaster', url: 'https://www.nexusmods.com/baldursgate3/users/956789' },
    downloads: 980000,
    rating: 5.0,
    version: '2.8.0',
    lastUpdated: '2023-12-31',
    requirements: ['native-mod-loader'],
    installGuide: 'Install using Native Mod Manager. Fixes are applied automatically.',
    downloadUrl: 'https://www.nexusmods.com/baldursgate3/mods/289',
    features: [
      'Bug fixes',
      'Performance fixes',
      'UI fixes',
      'Gameplay fixes'
    ],
    tags: ['fixes', 'patches', 'community']
  }
];

export const mods = sampleMods;

// Update category counts
categories.forEach(category => {
  category.count = mods.filter(mod => mod.category === category.id).length;
});
