const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

async function exportData() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '..', 'data', 'bg3mods.db');
    
    console.log('Connecting to SQLite database:', dbPath);
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
    });

    const exportData = {
      timestamp: new Date().toISOString(),
      tables: {},
      counts: {}
    };

    const tables = ['categories', 'mods', 'mod_images', 'mod_videos', 'mod_requirements', 'mod_features', 'mod_tags'];
    let completedTables = 0;

    tables.forEach(tableName => {
      db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
        if (err) {
          console.error(`Error reading table ${tableName}:`, err);
          exportData.tables[tableName] = [];
          exportData.counts[tableName] = 0;
        } else {
          console.log(`Table ${tableName}: ${rows.length} rows`);
          exportData.tables[tableName] = rows;
          exportData.counts[tableName] = rows.length;
        }

        completedTables++;
        if (completedTables === tables.length) {
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
            } else {
              console.log('Database connection closed');
            }
          });

          // 保存到文件
          const outputPath = path.join(__dirname, '..', 'data', 'exported-data.json');
          fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
          console.log('Data exported to:', outputPath);
          
          console.log('\nExport Summary:');
          console.log('================');
          Object.entries(exportData.counts).forEach(([table, count]) => {
            console.log(`${table}: ${count} records`);
          });

          resolve(exportData);
        }
      });
    });
  });
}

exportData().catch(console.error); 