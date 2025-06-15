import { getDb } from './db';
import { Mod } from '../types';

export async function checkModExists(modId: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.get('SELECT 1 FROM mods WHERE id = ?', modId);
  return !!result;
}

export async function createMod(mod: Mod) {
  const db = await getDb();
  
  await db.run('BEGIN TRANSACTION');
  
  try {
    // 检查ID是否已存在
    if (await checkModExists(mod.id)) {
      throw new Error('Mod ID already exists');
    }

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
      mod.author_name,
      mod.author_url,
      mod.downloads || 0,
      mod.rating || 0,
      mod.version,
      mod.last_updated,
      mod.download_url
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

    // 插入要求
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

    // 返回完整的mod数据
    const result = await getMod(mod.id);
    if (!result) {
      throw new Error('Failed to retrieve created mod');
    }
    return result;

  } catch (error) {
    await db.run('ROLLBACK');
    console.error('Error in createMod:', error);
    throw error;
  }
}

export async function getMod(modId: string): Promise<Mod | null> {
  const db = await getDb();
  
  try {
    // 获取主要mod信息
    const modRow = await db.get(`
      SELECT 
        m.*,
        json_group_array(DISTINCT json_object(
          'url', i.url,
          'caption', i.caption
        )) as images,
        json_group_array(DISTINCT json_object(
          'url', v.url,
          'title', v.title,
          'platform', v.platform
        )) as videos,
        json_group_array(DISTINCT json_object(
          'name', r.name,
          'url', r.url,
          'description', r.description
        )) as requirements,
        json_group_array(DISTINCT f.feature) as features,
        json_group_array(DISTINCT t.tag) as tags
      FROM mods m
      LEFT JOIN mod_images i ON m.id = i.mod_id
      LEFT JOIN mod_videos v ON m.id = v.mod_id
      LEFT JOIN mod_requirements r ON m.id = r.mod_id
      LEFT JOIN mod_features f ON m.id = f.mod_id
      LEFT JOIN mod_tags t ON m.id = t.mod_id
      WHERE m.id = ?
      GROUP BY m.id
    `, modId);

    if (!modRow) return null;

    // 解析JSON字符串
    const images = JSON.parse(modRow.images);
    const videos = JSON.parse(modRow.videos);
    const requirements = JSON.parse(modRow.requirements);
    const features = JSON.parse(modRow.features);
    const tags = JSON.parse(modRow.tags);

    // 构造返回对象
    return {
      id: modRow.id,
      name: modRow.name,
      description: modRow.description,
      category: modRow.category,
      author_name: modRow.author_name,
      author_url: modRow.author_url,
      downloads: modRow.downloads,
      rating: modRow.rating,
      version: modRow.version,
      last_updated: modRow.last_updated,
      download_url: modRow.download_url,
      images: images[0] === null ? [] : images,
      videos: videos[0] === null ? [] : videos,
      requirements: requirements[0] === null ? [] : requirements,
      features: features[0] === null ? [] : features,
      tags: tags[0] === null ? [] : tags
    };
  } catch (error) {
    console.error('Error in getMod:', error);
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
      mod.author_name,
      mod.author_url,
      mod.downloads || 0,
      mod.rating || 0,
      mod.version,
      mod.last_updated,
      mod.download_url,
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
    mods.map((mod: any) => getMod(mod.id))
  );
  
  return fullMods.filter((mod): mod is Mod => mod !== null);
}
