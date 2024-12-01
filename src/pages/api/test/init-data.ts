import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';
import { Category } from '../../../types/mod';

const sampleCategories: Category[] = [
  {
    id: 'prerequisites',
    name: '前置要求',
    description: '必需的基础模组和依赖项',
    icon: '🔧',
    count: 0
  },
  {
    id: 'ui',
    name: '界面优化',
    description: '改善游戏界面和用户体验的模组',
    icon: '🖥️',
    count: 0
  },
  {
    id: 'gameplay',
    name: '游戏玩法',
    description: '修改游戏核心机制、战斗系统、等级进展等内容的模组',
    icon: '🎮',
    count: 0
  },
  {
    id: 'appearance',
    name: '外观定制',
    description: '修改角色、装备、环境等视觉外观的模组',
    icon: '👤',
    count: 0
  },
  {
    id: 'equipment',
    name: '装备物品',
    description: '添加或修改武器、防具、道具等装备的模组',
    icon: '⚔️',
    count: 0
  },
  {
    id: 'dice',
    name: '骰子系统',
    description: '修改游戏骰子机制和概率系统的模组',
    icon: '🎲',
    count: 0
  },
  {
    id: 'balance',
    name: '平衡调整',
    description: '调整游戏平衡性、难度和数值的模组',
    icon: '⚖️',
    count: 0
  },
  {
    id: 'class',
    name: '职业扩展',
    description: '添加或修改职业、子职业和专长的模组',
    icon: '✨',
    count: 0
  },
  {
    id: 'modifiers',
    name: '属性修改',
    description: '修改游戏属性、状态和效果的模组',
    icon: '🛠️',
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
