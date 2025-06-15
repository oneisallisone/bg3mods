import { NextApiRequest, NextApiResponse } from 'next';
import { getDb, createTables } from '../../lib/db';
import exportedData from '../../../data/exported-data.json';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting import of original data...');
    console.log('Data timestamp:', exportedData.timestamp);
    console.log('Data counts:', exportedData.counts);
    
    // 检查是否在Vercel环境中
    const isVercel = !!process.env.VERCEL || !!process.env.POSTGRES_URL;
    console.log('Is Vercel environment:', isVercel);

    // 创建表
    console.log('Creating tables...');
    await createTables();
    console.log('Tables created successfully');

    const db = await getDb();
    console.log('Database connection established');

    // 清空现有数据
    console.log('Clearing existing data...');
    await db.run('DELETE FROM mod_tags');
    await db.run('DELETE FROM mod_features');
    await db.run('DELETE FROM mod_requirements');
    await db.run('DELETE FROM mod_videos');
    await db.run('DELETE FROM mod_images');
    await db.run('DELETE FROM mods');
    await db.run('DELETE FROM categories');

    let importStats = {
      categories: 0,
      mods: 0,
      mod_images: 0,
      mod_videos: 0,
      mod_requirements: 0,
      mod_features: 0,
      mod_tags: 0
    };

    // 导入分类
    console.log('Importing categories...');
    for (const category of exportedData.tables.categories) {
      await db.run(`
        INSERT INTO categories (id, name, description, icon, count)
        VALUES ($1, $2, $3, $4, $5)
      `, [category.id, category.name, category.description, category.icon, category.count]);
      importStats.categories++;
    }

    // 导入模组
    console.log('Importing mods...');
    for (const mod of exportedData.tables.mods) {
      await db.run(`
        INSERT INTO mods (id, name, description, category, author_name, author_url, downloads, rating, version, last_updated, download_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        mod.id, mod.name, mod.description, mod.category, mod.author_name, 
        mod.author_url, mod.downloads, mod.rating, mod.version, mod.last_updated, mod.download_url
      ]);
      importStats.mods++;
    }

    // 导入图片
    console.log('Importing mod images...');
    for (const image of exportedData.tables.mod_images) {
      await db.run(`
        INSERT INTO mod_images (mod_id, url, caption)
        VALUES ($1, $2, $3)
      `, [image.mod_id, image.url, image.caption]);
      importStats.mod_images++;
    }

    // 导入视频
    console.log('Importing mod videos...');
    for (const video of exportedData.tables.mod_videos) {
      await db.run(`
        INSERT INTO mod_videos (mod_id, url, title, platform)
        VALUES ($1, $2, $3, $4)
      `, [video.mod_id, video.url, video.title, video.platform]);
      importStats.mod_videos++;
    }

    // 导入前置要求
    console.log('Importing mod requirements...');
    for (const req of exportedData.tables.mod_requirements) {
      await db.run(`
        INSERT INTO mod_requirements (mod_id, name, url, description)
        VALUES ($1, $2, $3, $4)
      `, [req.mod_id, req.name, req.url, req.description]);
      importStats.mod_requirements++;
    }

    // 导入特性
    console.log('Importing mod features...');
    for (const feature of exportedData.tables.mod_features) {
      await db.run(`
        INSERT INTO mod_features (mod_id, feature)
        VALUES ($1, $2)
      `, [feature.mod_id, feature.feature]);
      importStats.mod_features++;
    }

    // 导入标签
    console.log('Importing mod tags...');
    for (const tag of exportedData.tables.mod_tags) {
      await db.run(`
        INSERT INTO mod_tags (mod_id, tag)
        VALUES ($1, $2)
      `, [tag.mod_id, tag.tag]);
      importStats.mod_tags++;
    }

    // 验证导入结果
    const verificationCounts = {
      categories: (await db.all('SELECT COUNT(*) as count FROM categories'))[0]?.count || 0,
      mods: (await db.all('SELECT COUNT(*) as count FROM mods'))[0]?.count || 0,
      mod_images: (await db.all('SELECT COUNT(*) as count FROM mod_images'))[0]?.count || 0,
      mod_videos: (await db.all('SELECT COUNT(*) as count FROM mod_videos'))[0]?.count || 0,
      mod_requirements: (await db.all('SELECT COUNT(*) as count FROM mod_requirements'))[0]?.count || 0,
      mod_features: (await db.all('SELECT COUNT(*) as count FROM mod_features'))[0]?.count || 0,
      mod_tags: (await db.all('SELECT COUNT(*) as count FROM mod_tags'))[0]?.count || 0
    };

    console.log('Import completed!');
    console.log('Import stats:', importStats);
    console.log('Verification counts:', verificationCounts);

    return res.status(200).json({
      success: true,
      message: 'Original data imported successfully',
      environment: isVercel ? 'vercel' : 'local',
      originalCounts: exportedData.counts,
      importStats,
      verificationCounts,
      dataTimestamp: exportedData.timestamp
    });

  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({
      success: false,
      error: 'Import failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 