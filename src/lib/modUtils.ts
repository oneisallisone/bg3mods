import { getDb } from './db';
import { Mod } from '../types/mod';

export async function createMod(mod: Mod) {
  const db = await getDb();
  
  await db.run('BEGIN TRANSACTION');
  
  try {
    // 插入主要 mod 信息
    await db.run(`
      INSERT INTO mods (
        id, name, description, category, 
        author_name, author_url, downloads, 
        rating, version, last_updated, download_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      mod.id,
      mod.name,
      mod.description,
      mod.category,
      mod.author.name,
      mod.author.url,
      mod.downloads || 0,
      mod.rating || 0,
      mod.version,
      mod.lastUpdated,
      mod.downloadUrl
    ]);

    // 插入图片
    if (mod.images && mod.images.length > 0) {
      const imageStmt = await db.prepare(
        'INSERT INTO mod_images (mod_id, url, caption) VALUES (?, ?, ?)'
      );
      for (const image of mod.images) {
        await imageStmt.run(mod.id, image.url, image.caption || null);
      }
      await imageStmt.finalize();
    }

    // 插入视频
    if (mod.videos && mod.videos.length > 0) {
      const videoStmt = await db.prepare(
        'INSERT INTO mod_videos (mod_id, url, title, platform) VALUES (?, ?, ?, ?)'
      );
      for (const video of mod.videos) {
        await videoStmt.run(mod.id, video.url, video.title || null, video.platform || null);
      }
      await videoStmt.finalize();
    }

    // 插入需求
    if (mod.requirements && mod.requirements.length > 0) {
      const reqStmt = await db.prepare(
        'INSERT INTO mod_requirements (mod_id, name, url, description) VALUES (?, ?, ?, ?)'
      );
      for (const req of mod.requirements) {
        await reqStmt.run(mod.id, req.name, req.url || null, req.description || null);
      }
      await reqStmt.finalize();
    }

    // 插入特性
    if (mod.features && mod.features.length > 0) {
      const featureStmt = await db.prepare(
        'INSERT INTO mod_features (mod_id, feature) VALUES (?, ?)'
      );
      for (const feature of mod.features) {
        await featureStmt.run(mod.id, feature);
      }
      await featureStmt.finalize();
    }

    // 插入标签
    if (mod.tags && mod.tags.length > 0) {
      const tagStmt = await db.prepare(
        'INSERT INTO mod_tags (mod_id, tag) VALUES (?, ?)'
      );
      for (const tag of mod.tags) {
        await tagStmt.run(mod.id, tag);
      }
      await tagStmt.finalize();
    }

    await db.run('COMMIT');
    return mod;
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

export async function updateMod(mod: Mod) {
  const db = await getDb();
  
  await db.run('BEGIN TRANSACTION');
  
  try {
    // 更新主要 mod 信息
    await db.run(`
      UPDATE mods SET
        name = ?,
        description = ?,
        category = ?,
        author_name = ?,
        author_url = ?,
        downloads = ?,
        rating = ?,
        version = ?,
        last_updated = ?,
        download_url = ?
      WHERE id = ?
    `, [
      mod.name,
      mod.description,
      mod.category,
      mod.author.name,
      mod.author.url,
      mod.downloads || 0,
      mod.rating || 0,
      mod.version,
      mod.lastUpdated,
      mod.downloadUrl,
      mod.id
    ]);

    // 删除所有相关数据
    await db.run('DELETE FROM mod_images WHERE mod_id = ?', mod.id);
    await db.run('DELETE FROM mod_videos WHERE mod_id = ?', mod.id);
    await db.run('DELETE FROM mod_requirements WHERE mod_id = ?', mod.id);
    await db.run('DELETE FROM mod_features WHERE mod_id = ?', mod.id);
    await db.run('DELETE FROM mod_tags WHERE mod_id = ?', mod.id);

    // 重新插入图片
    if (mod.images && mod.images.length > 0) {
      const imageStmt = await db.prepare(
        'INSERT INTO mod_images (mod_id, url, caption) VALUES (?, ?, ?)'
      );
      for (const image of mod.images) {
        await imageStmt.run(mod.id, image.url, image.caption || null);
      }
      await imageStmt.finalize();
    }

    // 重新插入视频
    if (mod.videos && mod.videos.length > 0) {
      const videoStmt = await db.prepare(
        'INSERT INTO mod_videos (mod_id, url, title, platform) VALUES (?, ?, ?, ?)'
      );
      for (const video of mod.videos) {
        await videoStmt.run(mod.id, video.url, video.title || null, video.platform || null);
      }
      await videoStmt.finalize();
    }

    // 重新插入需求
    if (mod.requirements && mod.requirements.length > 0) {
      const reqStmt = await db.prepare(
        'INSERT INTO mod_requirements (mod_id, name, url, description) VALUES (?, ?, ?, ?)'
      );
      for (const req of mod.requirements) {
        await reqStmt.run(mod.id, req.name, req.url || null, req.description || null);
      }
      await reqStmt.finalize();
    }

    // 重新插入特性
    if (mod.features && mod.features.length > 0) {
      const featureStmt = await db.prepare(
        'INSERT INTO mod_features (mod_id, feature) VALUES (?, ?)'
      );
      for (const feature of mod.features) {
        await featureStmt.run(mod.id, feature);
      }
      await featureStmt.finalize();
    }

    // 重新插入标签
    if (mod.tags && mod.tags.length > 0) {
      const tagStmt = await db.prepare(
        'INSERT INTO mod_tags (mod_id, tag) VALUES (?, ?)'
      );
      for (const tag of mod.tags) {
        await tagStmt.run(mod.id, tag);
      }
      await tagStmt.finalize();
    }

    await db.run('COMMIT');
    return mod;
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

export async function deleteMod(modId: string) {
  const db = await getDb();
  
  await db.run('BEGIN TRANSACTION');
  
  try {
    // 删除所有相关数据
    await db.run('DELETE FROM mod_images WHERE mod_id = ?', modId);
    await db.run('DELETE FROM mod_videos WHERE mod_id = ?', modId);
    await db.run('DELETE FROM mod_requirements WHERE mod_id = ?', modId);
    await db.run('DELETE FROM mod_features WHERE mod_id = ?', modId);
    await db.run('DELETE FROM mod_tags WHERE mod_id = ?', modId);
    
    // 删除主要 mod 信息
    await db.run('DELETE FROM mods WHERE id = ?', modId);
    
    await db.run('COMMIT');
    return true;
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

export async function getMod(modId: string): Promise<Mod | null> {
  const db = await getDb();
  
  // 获取主要 mod 信息
  const mod = await db.get(`
    SELECT * FROM mods WHERE id = ?
  `, modId);
  
  if (!mod) return null;
  
  // 获取图片
  const images = await db.all(`
    SELECT url, caption FROM mod_images WHERE mod_id = ?
  `, modId);
  
  // 获取视频
  const videos = await db.all(`
    SELECT url, title, platform FROM mod_videos WHERE mod_id = ?
  `, modId);
  
  // 获取需求
  const requirements = await db.all(`
    SELECT name, url, description FROM mod_requirements WHERE mod_id = ?
  `, modId);
  
  // 获取特性
  const features = await db.all(`
    SELECT feature FROM mod_features WHERE mod_id = ?
  `, modId);
  
  // 获取标签
  const tags = await db.all(`
    SELECT tag FROM mod_tags WHERE mod_id = ?
  `, modId);
  
  return {
    id: mod.id,
    name: mod.name,
    description: mod.description,
    category: mod.category,
    author: {
      name: mod.author_name,
      url: mod.author_url
    },
    downloads: mod.downloads,
    rating: mod.rating,
    version: mod.version,
    lastUpdated: mod.last_updated,
    downloadUrl: mod.download_url,
    images: images.map(img => ({
      url: img.url,
      caption: img.caption || ''
    })),
    videos: videos.map(vid => ({
      url: vid.url,
      title: vid.title || '',
      platform: vid.platform || 'other'
    })),
    requirements: requirements.map(req => ({
      name: req.name,
      url: req.url || '',
      description: req.description || ''
    })),
    features: features.map(f => f.feature),
    tags: tags.map(t => t.tag)
  };
}

export async function listMods(category?: string): Promise<Mod[]> {
  const db = await getDb();
  
  // 构建查询条件
  const whereClause = category ? 'WHERE category = ?' : '';
  const params = category ? [category] : [];
  
  // 获取所有 mods 的基本信息
  const mods = await db.all(`
    SELECT * FROM mods ${whereClause}
  `, ...params);
  
  // 为每个 mod 获取完整信息
  const fullMods = await Promise.all(
    mods.map(mod => getMod(mod.id))
  );
  
  return fullMods.filter((mod): mod is Mod => mod !== null);
}
