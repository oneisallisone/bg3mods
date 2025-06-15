import { NextApiRequest, NextApiResponse } from 'next';
import { getDb, createTables } from '../../lib/db';

// 示例数据
const sampleCategories = [
  {
    id: 'character',
    name: 'Character',
    description: 'Character creation and customization mods',
    icon: '👤',
    count: 0
  },
  {
    id: 'gameplay',
    name: 'Gameplay',
    description: 'Mods that enhance or modify gameplay mechanics',
    icon: '⚔️',
    count: 0
  },
  {
    id: 'ui',
    name: 'UI & Interface',
    description: 'User interface improvements and modifications',
    icon: '🖥️',
    count: 0
  },
  {
    id: 'appearance',
    name: 'Appearance',
    description: 'Visual modifications and appearance enhancements',
    icon: '✨',
    count: 0
  },
  {
    id: 'equipment',
    name: 'Equipment',
    description: 'Weapons, armor, and equipment modifications',
    icon: '⚔️',
    count: 0
  }
];

const sampleMods = [
  {
    id: 'bg3-mod-manager',
    name: 'BG3 Mod Manager',
    description: 'Official mod management tool for BG3',
    category: 'prerequisites',
    author_name: 'LaughingLeader',
    last_updated: '2024-10-27',
    downloads: 50000,
    rating: 4.8,
    version: '1.2.0'
  },
  {
    id: 'tavs-hair-salon',
    name: "Tav's Hair Salon",
    description: 'A mod adding a large variety of hairstyles for different body types and races',
    category: 'appearance',
    author_name: 'toarie',
    last_updated: '2024-11-15',
    downloads: 25000,
    rating: 4.6,
    version: '2.1.0'
  },
  {
    id: 'enhanced-party-limit',
    name: 'Enhanced Party Limit',
    description: 'Allows more than 4 party members in your adventure',
    category: 'gameplay',
    author_name: 'Sildurs',
    last_updated: '2024-11-01',
    downloads: 15000,
    rating: 4.4,
    version: '1.0.3'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting Vercel database initialization...');
    
    // 检查是否在Vercel环境中
    const isVercel = !!process.env.VERCEL || !!process.env.POSTGRES_URL;
    console.log('Is Vercel environment:', isVercel);
    console.log('Environment variables:', {
      VERCEL: !!process.env.VERCEL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
    });

    // 创建表
    console.log('Creating tables...');
    await createTables();
    console.log('Tables created successfully');

    const db = await getDb();
    console.log('Database connection established');

    // 检查是否已有数据
    try {
      const existingCategories = await db.all('SELECT COUNT(*) as count FROM categories');
      const existingMods = await db.all('SELECT COUNT(*) as count FROM mods');
      
      console.log('Existing data:', {
        categories: existingCategories[0]?.count || 0,
        mods: existingMods[0]?.count || 0
      });

      // 插入分类数据（如果没有）
      if (!existingCategories[0]?.count) {
        console.log('Inserting sample categories...');
        for (const category of sampleCategories) {
          await db.run(`
            INSERT INTO categories (id, name, description, icon, count)
            VALUES ($1, $2, $3, $4, $5)
          `, [category.id, category.name, category.description, category.icon, category.count]);
        }
        console.log('Categories inserted successfully');
      }

      // 插入模组数据（如果没有）
      if (!existingMods[0]?.count) {
        console.log('Inserting sample mods...');
        for (const mod of sampleMods) {
          await db.run(`
            INSERT INTO mods (id, name, description, category, author_name, last_updated, downloads, rating, version)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [mod.id, mod.name, mod.description, mod.category, mod.author_name, mod.last_updated, mod.downloads, mod.rating, mod.version]);
        }
        console.log('Mods inserted successfully');
      }

      // 验证数据
      const finalCategories = await db.all('SELECT * FROM categories LIMIT 5');
      const finalMods = await db.all('SELECT * FROM mods LIMIT 5');

      return res.status(200).json({
        success: true,
        message: 'Vercel database initialized successfully',
        environment: isVercel ? 'vercel' : 'local',
        data: {
          categories: finalCategories,
          mods: finalMods
        }
      });

    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Database operation failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown error',
        environment: isVercel ? 'vercel' : 'local'
      });
    }

  } catch (error) {
    console.error('Initialization error:', error);
    return res.status(500).json({
      success: false,
      error: 'Initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 