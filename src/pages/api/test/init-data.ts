import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';
import { Category } from '../../../types';

const sampleCategories: Category[] = [
  {
    id: 'prerequisites',
    name: 'Prerequisites & Tools',
    description: 'Essential tools and prerequisites for modding',
    icon: '',
    count: 0
  },
  {
    id: 'ui',
    name: 'UI Mods',
    description: 'Interface modifications and enhancements',
    icon: '',
    count: 0
  },
  {
    id: 'gameplay',
    name: 'Gameplay Mods',
    description: 'Mods that modify gameplay mechanics',
    icon: '',
    count: 0
  },
  {
    id: 'appearance',
    name: 'Appearance Mods',
    description: 'Mods that modify the game\'s appearance',
    icon: '',
    count: 0
  },
  {
    id: 'equipment',
    name: 'Equipment Mods',
    description: 'Mods that add or modify equipment',
    icon: '',
    count: 0
  },
  {
    id: 'dice',
    name: 'Dice Mods',
    description: 'Mods that modify the game\'s dice mechanics',
    icon: '',
    count: 0
  },
  {
    id: 'balance',
    name: 'Balance Mods',
    description: 'Mods that modify the game\'s balance',
    icon: '',
    count: 0
  },
  {
    id: 'class',
    name: 'Class Mods',
    description: 'Mods that add or modify classes',
    icon: '',
    count: 0
  },
  {
    id: 'modifiers',
    name: 'Modifier Mods',
    description: 'Mods that modify the game\'s modifiers',
    icon: '',
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

    // 清空现有类目
    await db.run('DELETE FROM categories');

    // 插入新类目
    for (const category of sampleCategories) {
      await db.run(`
        INSERT INTO categories (id, name, description, icon, count)
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
    return res.status(500).json({ error: 'Failed to initialize sample data' });
  }
}
