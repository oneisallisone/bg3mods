import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';
import { Category } from '../../../types/mod';

const sampleCategories: Category[] = [
  {
    id: 'ui',
    name: '界面优化',
    description: '优化游戏界面和用户体验的模组',
    icon: '🎨',
    count: 0
  },
  {
    id: 'gameplay',
    name: '游戏玩法',
    description: '改变或增强游戏玩法的模组',
    icon: '🎮',
    count: 0
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const db = await getDb();

  try {
    // 开始事务
    await db.run('BEGIN TRANSACTION');

    // 插入分类
    for (const category of sampleCategories) {
      await db.run(`
        INSERT OR REPLACE INTO categories (id, name, description, icon, count)
        VALUES (?, ?, ?, ?, ?)
      `, [category.id, category.name, category.description, category.icon, category.count]);
    }

    // 提交事务
    await db.run('COMMIT');

    return res.status(200).json({ message: 'Sample data initialized successfully' });
  } catch (error) {
    // 回滚事务
    await db.run('ROLLBACK');
    console.error('Error initializing sample data:', error);
    return res.status(500).json({ error: 'Failed to initialize sample data', details: error.message });
  }
}
