import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/db';
import { Mod } from '../../../types/mod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const db = await getDb();

  try {
    switch (req.method) {
      case 'PUT':
        const mod = req.body as Mod;
        
        // 开始事务
        await db.run('BEGIN TRANSACTION');

        try {
          // 更新mod基本信息
          await db.run(`
            UPDATE mods 
            SET name = ?, description = ?, category = ?,
                author_name = ?, author_url = ?, downloads = ?,
                rating = ?, version = ?, last_updated = ?,
                download_url = ?
            WHERE id = ?
          `, [
            mod.name,
            mod.description,
            mod.category,
            mod.author.name,
            mod.author.url,
            mod.downloads,
            mod.rating,
            mod.version,
            mod.lastUpdated,
            mod.downloadUrl,
            id
          ]);

          // 删除所有相关数据
          await db.run('DELETE FROM mod_images WHERE mod_id = ?', [id]);
          await db.run('DELETE FROM mod_videos WHERE mod_id = ?', [id]);
          await db.run('DELETE FROM mod_requirements WHERE mod_id = ?', [id]);
          await db.run('DELETE FROM mod_features WHERE mod_id = ?', [id]);
          await db.run('DELETE FROM mod_tags WHERE mod_id = ?', [id]);

          // 重新插入图片
          for (const image of mod.images) {
            await db.run(
              'INSERT INTO mod_images (mod_id, url, caption) VALUES (?, ?, ?)',
              [id, image.url, image.caption]
            );
          }

          // 重新插入视频
          for (const video of mod.videos) {
            await db.run(
              'INSERT INTO mod_videos (mod_id, url, title, platform) VALUES (?, ?, ?, ?)',
              [id, video.url, video.title, video.platform]
            );
          }

          // 重新插入要求
          for (const req of mod.requirements) {
            await db.run(
              'INSERT INTO mod_requirements (mod_id, name, url, description) VALUES (?, ?, ?, ?)',
              [id, req.name, req.url, req.description]
            );
          }

          // 重新插入特性
          for (const feature of mod.features) {
            await db.run(
              'INSERT INTO mod_features (mod_id, feature) VALUES (?, ?)',
              [id, feature]
            );
          }

          // 重新插入标签
          for (const tag of mod.tags) {
            await db.run(
              'INSERT INTO mod_tags (mod_id, tag) VALUES (?, ?)',
              [id, tag]
            );
          }

          // 提交事务
          await db.run('COMMIT');
          return res.status(200).json(mod);
        } catch (error) {
          // 回滚事务
          await db.run('ROLLBACK');
          throw error;
        }

      case 'DELETE':
        await db.run('BEGIN TRANSACTION');
        try {
          // 删除所有相关数据
          await db.run('DELETE FROM mod_images WHERE mod_id = ?', [id]);
          await db.run('DELETE FROM mod_videos WHERE mod_id = ?', [id]);
          await db.run('DELETE FROM mod_requirements WHERE mod_id = ?', [id]);
          await db.run('DELETE FROM mod_features WHERE mod_id = ?', [id]);
          await db.run('DELETE FROM mod_tags WHERE mod_id = ?', [id]);
          await db.run('DELETE FROM mods WHERE id = ?', [id]);
          
          await db.run('COMMIT');
          return res.status(204).end();
        } catch (error) {
          await db.run('ROLLBACK');
          throw error;
        }

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
