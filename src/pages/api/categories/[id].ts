import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';
import { Category } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const db = await getDb();

  try {
    switch (req.method) {
      case 'PUT':
        const category = req.body as Category;
        
        await db.run(`
          UPDATE categories 
          SET name = ?, description = ?, icon = ?, count = ?
          WHERE id = ?
        `, [
          category.name,
          category.description,
          category.icon,
          category.count || 0,
          id
        ]);

        return res.status(200).json(category);

      case 'DELETE':
        // 检查是否有关联的mods
        const modsCount = await db.get(
          'SELECT COUNT(*) as count FROM mods WHERE category = ?',
          [id]
        );

        if (modsCount.count > 0) {
          return res.status(400).json({
            error: '无法删除该分类，请先删除或移动该分类下的所有Mods'
          });
        }

        await db.run('DELETE FROM categories WHERE id = ?', [id]);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
