import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const db = await getDb();

  try {
    // 开始事务
    await db.run('BEGIN TRANSACTION');

    // 插入测试mod
    await db.run(`
      INSERT OR REPLACE INTO mods (
        id, name, description, category,
        author_name, author_url, downloads,
        rating, version, last_updated, download_url
      ) VALUES (
        'test-mod-1',
        '测试Mod',
        '这是一个测试Mod',
        'character',
        '测试作者',
        'https://example.com',
        100,
        4.5,
        '1.0.0',
        '2024-01-01',
        'https://example.com/download'
      )
    `);

    // 插入测试图片
    await db.run(`
      INSERT OR REPLACE INTO mod_images (mod_id, url, caption)
      VALUES ('test-mod-1', 'https://example.com/image1.jpg', '测试图片1')
    `);

    // 插入测试视频
    await db.run(`
      INSERT OR REPLACE INTO mod_videos (mod_id, url, title, platform)
      VALUES ('test-mod-1', 'https://youtube.com/test', '测试视频', 'youtube')
    `);

    // 插入测试要求
    await db.run(`
      INSERT OR REPLACE INTO mod_requirements (mod_id, name, url, description)
      VALUES ('test-mod-1', '基础游戏', 'https://example.com', '需要基础游戏')
    `);

    // 插入测试特性
    await db.run(`
      INSERT OR REPLACE INTO mod_features (mod_id, feature)
      VALUES ('test-mod-1', '新增角色')
    `);

    // 插入测试标签
    await db.run(`
      INSERT OR REPLACE INTO mod_tags (mod_id, tag)
      VALUES ('test-mod-1', '角色')
    `);

    // 提交事务
    await db.run('COMMIT');

    return res.status(200).json({ message: 'Test data initialized successfully' });
  } catch (error) {
    // 回滚事务
    await db.run('ROLLBACK');
    console.error('Error initializing test data:', error);
    return res.status(500).json({ error: 'Failed to initialize test data', details: error });
  }
}
