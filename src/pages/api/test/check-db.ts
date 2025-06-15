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
    // 检查环境并使用相应的查询
    const isVercel = !!process.env.VERCEL || !!process.env.POSTGRES_URL;
    
    let tables;
    if (isVercel) {
      // PostgreSQL查询
      tables = await db.all(`
        SELECT table_name as name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `);
    } else {
      // SQLite查询
      tables = await db.all(`
        SELECT name FROM sqlite_master 
        WHERE type='table'
      `);
    }

    // 获取每个表的数据
    const data: any = {};
    for (const table of tables) {
      try {
        const rows = await db.all(`SELECT * FROM ${table.name}`);
        data[table.name] = rows;
      } catch (error) {
        data[table.name] = { error: 'Failed to fetch data' };
      }
    }

    return res.status(200).json({
      environment: isVercel ? 'vercel' : 'local',
      tables: tables.map((t: any) => t.name),
      data
    });
  } catch (error) {
    console.error('Database check error:', error);
    return res.status(500).json({ error: 'Database check failed', details: error });
  }
}
