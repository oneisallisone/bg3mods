// 检测运行环境并使用相应的数据库
const isVercel = !!process.env.VERCEL || !!process.env.POSTGRES_URL;

export async function createTables() {
  if (isVercel) {
    // Vercel环境：使用PostgreSQL
    const { sql } = require('@vercel/postgres');
    
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        count INTEGER DEFAULT 0
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        author_name TEXT,
        author_url TEXT,
        downloads INTEGER DEFAULT 0,
        rating REAL DEFAULT 0,
        version TEXT,
        last_updated TEXT,
        download_url TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mod_images (
        id SERIAL PRIMARY KEY,
        mod_id TEXT,
        url TEXT NOT NULL,
        caption TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mod_videos (
        id SERIAL PRIMARY KEY,
        mod_id TEXT,
        url TEXT NOT NULL,
        title TEXT,
        platform TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mod_requirements (
        id SERIAL PRIMARY KEY,
        mod_id TEXT,
        name TEXT NOT NULL,
        url TEXT,
        description TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mod_features (
        id SERIAL PRIMARY KEY,
        mod_id TEXT,
        feature TEXT NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mod_tags (
        id SERIAL PRIMARY KEY,
        mod_id TEXT,
        tag TEXT NOT NULL
      );
    `;
  } else {
    // 本地环境：使用SQLite
    const database = await getDb();
    await database.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS mods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        author_name TEXT,
        author_url TEXT,
        downloads INTEGER DEFAULT 0,
        rating REAL DEFAULT 0,
        version TEXT,
        last_updated TEXT,
        download_url TEXT
      );

      CREATE TABLE IF NOT EXISTS mod_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mod_id TEXT,
        url TEXT NOT NULL,
        caption TEXT
      );

      CREATE TABLE IF NOT EXISTS mod_videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mod_id TEXT,
        url TEXT NOT NULL,
        title TEXT,
        platform TEXT
      );

      CREATE TABLE IF NOT EXISTS mod_requirements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mod_id TEXT,
        name TEXT NOT NULL,
        url TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS mod_features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mod_id TEXT,
        feature TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS mod_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mod_id TEXT,
        tag TEXT NOT NULL
      );
    `);
  }
}

let db: any = null;

export async function getDb() {
  if (isVercel) {
    // Vercel环境：优先尝试PostgreSQL，失败则使用JSON文件
    try {
      const { sql } = require('@vercel/postgres');
      
      // 测试连接
      await sql`SELECT 1`;
      
      // 初始化表
      await createTables();
      
      // 返回一个兼容的接口
      return {
        all: async (query: string, ...params: any[]) => {
          // 转换SQLite语法为PostgreSQL语法
          const pgQuery = query.replace(/\?/g, (match, offset) => {
            const paramIndex = query.substring(0, offset).split('?').length;
            return `$${paramIndex}`;
          });
          const result = await sql.query(pgQuery, params);
          return result.rows;
        },
        get: async (query: string, ...params: any[]) => {
          // 转换SQLite语法为PostgreSQL语法
          const pgQuery = query.replace(/\?/g, (match, offset) => {
            const paramIndex = query.substring(0, offset).split('?').length;
            return `$${paramIndex}`;
          });
          const result = await sql.query(pgQuery + ' LIMIT 1', params);
          return result.rows[0] || null;
        },
        run: async (query: string, ...params: any[]) => {
          // 转换SQLite语法为PostgreSQL语法  
          const pgQuery = query.replace(/\?/g, (match, offset) => {
            const paramIndex = query.substring(0, offset).split('?').length;
            return `$${paramIndex}`;
          });
          await sql.query(pgQuery, params);
        },
        exec: async (query: string) => {
          await sql.query(query);
        },
        prepare: (query: string) => {
          return {
            run: async (...params: any[]) => {
              // 转换SQLite语法为PostgreSQL语法
              const pgQuery = query.replace(/\?/g, (match, offset) => {
                const paramIndex = query.substring(0, offset).split('?').length;
                return `$${paramIndex}`;
              });
              await sql.query(pgQuery, params);
            },
            finalize: async () => {
              // PostgreSQL不需要finalize
            }
          };
        }
      };
    } catch (error) {
      console.warn('PostgreSQL not available, using JSON file fallback:', error);
      
      // 返回基于JSON文件的数据接口
      const exportedData = require('../../data/exported-data.json');
      
      return {
        all: async (query: string, ...params: any[]) => {
          // 简单的表名匹配，返回对应的JSON数据
          if (query.includes('categories')) return exportedData.tables.categories || [];
          if (query.includes('mods')) return exportedData.tables.mods || [];
          if (query.includes('mod_images')) return exportedData.tables.mod_images || [];
          if (query.includes('mod_videos')) return exportedData.tables.mod_videos || [];
          if (query.includes('mod_requirements')) return exportedData.tables.mod_requirements || [];
          if (query.includes('mod_features')) return exportedData.tables.mod_features || [];
          if (query.includes('mod_tags')) return exportedData.tables.mod_tags || [];
          return [];
        },
        get: async (query: string, ...params: any[]) => {
          // 简单的表名匹配，返回对应的JSON数据
          if (query.includes('categories')) return exportedData.tables.categories[0] || null;
          if (query.includes('mods')) return exportedData.tables.mods[0] || null;
          if (query.includes('mod_images')) return exportedData.tables.mod_images[0] || null;
          if (query.includes('mod_videos')) return exportedData.tables.mod_videos[0] || null;
          if (query.includes('mod_requirements')) return exportedData.tables.mod_requirements[0] || null;
          if (query.includes('mod_features')) return exportedData.tables.mod_features[0] || null;
          if (query.includes('mod_tags')) return exportedData.tables.mod_tags[0] || null;
          return null;
        },
        run: async () => {
          // JSON文件是只读的，忽略写操作
          console.log('Write operation ignored (JSON file mode)');
        },
        exec: async () => {
          // JSON文件是只读的，忽略写操作
          console.log('Exec operation ignored (JSON file mode)');
        },
        prepare: () => ({
          run: async () => {
            console.log('Prepared statement ignored (JSON file mode)');
          },
          finalize: async () => {}
        })
      };
    }
  } else {
    // 本地环境：使用SQLite
    if (db) return db;

    try {
      const { Database } = require('sqlite3');
      const { open } = require('sqlite');
      const path = require('path');

      const dbPath = path.join(process.cwd(), 'data', 'bg3mods.db');
      
      db = await open({
        filename: dbPath,
        driver: Database
      });

      await createTables();
      return db;
    } catch (error) {
      // 如果sqlite3不可用（比如在某些部署环境中），返回空数据
      console.warn('SQLite not available, returning empty data');
      return {
        all: async () => [],
        get: async () => null,
        run: async () => {},
        exec: async () => {},
        prepare: () => ({
          run: async () => {},
          finalize: async () => {}
        })
      };
    }
  }
}

export async function getAllMods() {
  try {
    const db = await getDb();
    console.log('Database connected successfully');
    
    // 获取所有mods的基本信息
    const mods = await db.all(`
      SELECT 
        m.id, 
        m.name, 
        m.description, 
        m.category, 
        m.author_name,
        m.last_updated
      FROM mods m
      ORDER BY m.last_updated DESC
    `);

    // 为每个mod获取图片和视频
    for (const mod of mods) {
      // 获取图片
      const images = await db.all(`
        SELECT url, caption
        FROM mod_images
        WHERE mod_id = ?
      `, [mod.id]);
      mod.images = images;

      // 获取视频
      const videos = await db.all(`
        SELECT url, title, platform
        FROM mod_videos
        WHERE mod_id = ?
      `, [mod.id]);
      mod.videos = videos;
    }
    
    console.log(`Found ${mods?.length || 0} mods in database`);
    if (mods?.length > 0) {
      console.log('First mod:', JSON.stringify(mods[0], null, 2));
    }
    
    return mods;
  } catch (error) {
    console.error('Error in getAllMods:', error);
    return [];
  }
}

export async function closeDb() {
  if (db) {
    await db.close();
    db = null;
  }
}
