import { Database } from 'sqlite3';
import { open, Database as SQLiteDatabase } from 'sqlite';
import path from 'path';

let db: SQLiteDatabase | null = null;

export async function getDb() {
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'data', 'bg3mods.db');
  
  db = await open({
    filename: dbPath,
    driver: Database
  });

  // 创建表
  await db.exec(`
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
      download_url TEXT,
      FOREIGN KEY (category) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS mod_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mod_id TEXT,
      url TEXT NOT NULL,
      caption TEXT,
      FOREIGN KEY (mod_id) REFERENCES mods(id)
    );

    CREATE TABLE IF NOT EXISTS mod_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mod_id TEXT,
      url TEXT NOT NULL,
      title TEXT,
      platform TEXT,
      FOREIGN KEY (mod_id) REFERENCES mods(id)
    );

    CREATE TABLE IF NOT EXISTS mod_requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mod_id TEXT,
      name TEXT NOT NULL,
      url TEXT,
      description TEXT,
      FOREIGN KEY (mod_id) REFERENCES mods(id)
    );

    CREATE TABLE IF NOT EXISTS mod_features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mod_id TEXT,
      feature TEXT NOT NULL,
      FOREIGN KEY (mod_id) REFERENCES mods(id)
    );

    CREATE TABLE IF NOT EXISTS mod_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mod_id TEXT,
      tag TEXT NOT NULL,
      FOREIGN KEY (mod_id) REFERENCES mods(id)
    );
  `);

  return db;
}

export async function getAllMods() {
  try {
    const db = await getDb();
    console.log('Database connected successfully');
    
    const mods = await db.all(`
      SELECT id, name, description, category, last_updated
      FROM mods
      ORDER BY last_updated DESC
    `);
    
    console.log(`Found ${mods?.length || 0} mods in database`);
    if (mods?.length > 0) {
      console.log('First mod:', JSON.stringify(mods[0], null, 2));
    }
    
    return mods || [];
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
