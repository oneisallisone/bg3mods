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
    // 检查表是否存在
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table'
    `);

    // 获取每个表的数据
    const data: any = {};
    for (const table of tables) {
      const rows = await db.all(`SELECT * FROM ${table.name}`);
      data[table.name] = rows;
    }

    return res.status(200).json({
      tables: tables.map(t => t.name),
      data
    });
  } catch (error) {
    console.error('Database check error:', error);
    return res.status(500).json({ error: 'Database check failed', details: error });
  }
}
