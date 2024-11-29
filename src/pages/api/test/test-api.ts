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
    // 测试数据库连接
    const categories = await db.all('SELECT * FROM categories');
    const mods = await db.all('SELECT * FROM mods');
    const images = await db.all('SELECT * FROM mod_images');
    const videos = await db.all('SELECT * FROM mod_videos');
    const requirements = await db.all('SELECT * FROM mod_requirements');

    return res.status(200).json({
      message: 'Database connection successful',
      data: {
        categories,
        mods,
        images,
        videos,
        requirements
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({ error: 'Database test failed' });
  }
}
