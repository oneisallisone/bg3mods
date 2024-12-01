import type { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Mod } from '../../../types/mod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { mods } = req.body;

    if (!Array.isArray(mods)) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    // 打开SQLite数据库连接
    const db = await open({
      filename: './data/bg3mods.db',
      driver: sqlite3.Database
    });

    // 开始事务
    await db.run('BEGIN TRANSACTION');

    try {
      for (const mod of mods) {
        // 插入mod基本信息
        await db.run(
          `INSERT OR REPLACE INTO mods (
            id, name, description, category, author_name, author_url,
            downloads, rating, version, last_updated, download_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mod.id,
            mod.name,
            mod.description,
            mod.category,
            mod.author?.name || '',
            mod.author?.url || '',
            mod.downloads || 0,
            mod.rating || 0,
            mod.version,
            mod.lastUpdated,
            mod.downloadUrl || ''
          ]
        );

        // 插入features
        if (mod.features && mod.features.length > 0) {
          await db.run('DELETE FROM mod_features WHERE mod_id = ?', [mod.id]);
          for (const feature of mod.features) {
            await db.run(
              'INSERT INTO mod_features (mod_id, feature) VALUES (?, ?)',
              [mod.id, feature]
            );
          }
        }

        // 插入tags
        if (mod.tags && mod.tags.length > 0) {
          await db.run('DELETE FROM mod_tags WHERE mod_id = ?', [mod.id]);
          for (const tag of mod.tags) {
            await db.run(
              'INSERT INTO mod_tags (mod_id, tag) VALUES (?, ?)',
              [mod.id, tag]
            );
          }
        }

        // 插入requirements
        if (mod.requirements && mod.requirements.length > 0) {
          await db.run('DELETE FROM mod_requirements WHERE mod_id = ?', [mod.id]);
          for (const req of mod.requirements) {
            await db.run(
              'INSERT INTO mod_requirements (mod_id, name, url, description) VALUES (?, ?, ?, ?)',
              [mod.id, req.name, req.url || '', req.description || '']
            );
          }
        }

        // 插入images
        if (mod.images && mod.images.length > 0) {
          await db.run('DELETE FROM mod_images WHERE mod_id = ?', [mod.id]);
          for (const img of mod.images) {
            await db.run(
              'INSERT INTO mod_images (mod_id, url, caption) VALUES (?, ?, ?)',
              [mod.id, img.url, img.caption || '']
            );
          }
        }

        // 插入videos
        if (mod.videos && mod.videos.length > 0) {
          await db.run('DELETE FROM mod_videos WHERE mod_id = ?', [mod.id]);
          for (const video of mod.videos) {
            await db.run(
              'INSERT INTO mod_videos (mod_id, url, title, platform) VALUES (?, ?, ?, ?)',
              [mod.id, video.url, video.title || '', video.platform || '']
            );
          }
        }
      }

      // 提交事务
      await db.run('COMMIT');

      // 获取刚刚导入的mods
      const importedMods = await db.all(`
        SELECT m.*,
               GROUP_CONCAT(DISTINCT f.feature) as features,
               GROUP_CONCAT(DISTINCT t.tag) as tags
        FROM mods m
        LEFT JOIN mod_features f ON m.id = f.mod_id
        LEFT JOIN mod_tags t ON m.id = t.mod_id
        WHERE m.id IN (${mods.map(() => '?').join(',')})
        GROUP BY m.id
      `, mods.map(m => m.id));

      // 关闭数据库连接
      await db.close();

      // 返回成功响应
      res.status(200).json({ success: true, message: `Successfully imported ${mods.length} mods` });
    } catch (error) {
      // 如果出错，回滚事务
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Bulk import error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
