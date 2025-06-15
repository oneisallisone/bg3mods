import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 强制使用SQLite连接
    const { Database } = require('sqlite3');
    const { open } = require('sqlite');
    const path = require('path');

    const dbPath = path.join(process.cwd(), 'data', 'bg3mods.db');
    
    const db = await open({
      filename: dbPath,
      driver: Database
    });

    console.log('Connected to SQLite database for export');

    // 导出所有表的数据
    const categories = await db.all('SELECT * FROM categories');
    const mods = await db.all('SELECT * FROM mods');
    const mod_images = await db.all('SELECT * FROM mod_images');
    const mod_videos = await db.all('SELECT * FROM mod_videos');
    const mod_requirements = await db.all('SELECT * FROM mod_requirements');
    const mod_features = await db.all('SELECT * FROM mod_features');
    const mod_tags = await db.all('SELECT * FROM mod_tags');

    console.log('Exported data counts:', {
      categories: categories.length,
      mods: mods.length,
      mod_images: mod_images.length,
      mod_videos: mod_videos.length,
      mod_requirements: mod_requirements.length,
      mod_features: mod_features.length,
      mod_tags: mod_tags.length
    });

    // 关闭数据库连接
    await db.close();

    const exportData = {
      timestamp: new Date().toISOString(),
      tables: {
        categories,
        mods,
        mod_images,
        mod_videos,
        mod_requirements,
        mod_features,
        mod_tags
      },
      counts: {
        categories: categories.length,
        mods: mods.length,
        mod_images: mod_images.length,
        mod_videos: mod_videos.length,
        mod_requirements: mod_requirements.length,
        mod_features: mod_features.length,
        mod_tags: mod_tags.length
      }
    };

    return res.status(200).json(exportData);

  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({
      error: 'Export failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 