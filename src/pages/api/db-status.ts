import { NextApiRequest, NextApiResponse } from 'next'
import { getDb } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDb();
    
    // Get table counts
    const modCount = await db.get('SELECT COUNT(*) as count FROM mods');
    const categoryCount = await db.get('SELECT COUNT(*) as count FROM categories');
    
    // Get sample data
    const sampleMods = await db.all('SELECT * FROM mods LIMIT 3');
    const sampleCategories = await db.all('SELECT * FROM categories LIMIT 3');
    
    res.status(200).json({
      status: 'ok',
      counts: {
        mods: modCount,
        categories: categoryCount
      },
      samples: {
        mods: sampleMods,
        categories: sampleCategories
      }
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({ error: 'Failed to get database status' });
  }
}
