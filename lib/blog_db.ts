import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db: any;

async function openDb() {
  if (!db) {
    db = await open({
      filename: "./blog.sqlite",
      driver: sqlite3.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        status TEXT,
        createdAt TEXT,
        updatedAt TEXT
      )
    `);
  }
  return db;
}

export { openDb };
