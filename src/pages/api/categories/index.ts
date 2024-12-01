import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';
import { Category } from '../../../types/mod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();

  try {
    switch (req.method) {
      case 'GET':
        const categories = await db.all(`
          SELECT 
            c.*,
            COUNT(m.id) as mod_count
          FROM categories c
          LEFT JOIN mods m ON c.id = m.category
          GROUP BY c.id
        `);

        // 处理结果
        const processedCategories = categories.map(cat => ({
          ...cat,
          count: cat.mod_count || 0
        }));

        return res.status(200).json(processedCategories);

      case 'POST':
        const category = req.body as Category;
        
        await db.run(`
          INSERT INTO categories (id, name, description, icon, count)
          VALUES (?, ?, ?, ?, ?)
        `, [
          category.id,
          category.name,
          category.description,
          category.icon,
          category.count || 0
        ]);

        return res.status(201).json(category);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
