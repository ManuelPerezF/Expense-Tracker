import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function initializeDatabase(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  if (db) {
    return db;
  }

  const dbPath = path.join(__dirname, "../database.sqlite");

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Crear tablas si no existen
  await createTables();

  return db;
}

async function createTables() {
  if (!db) throw new Error("Database not initialized");

  // Tabla de usuarios simplificada
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de categorías simplificada
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      emoji TEXT DEFAULT '📁',
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Tabla de movimientos (gastos/ingresos) simplificada
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('gasto', 'entrada')),
      category_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Insertar categorías por defecto para gastos
  await db.exec(`
    INSERT OR IGNORE INTO categories (id, name, emoji, user_id) VALUES 
    (1, 'Alimentación', '🍔', 1),
    (2, 'Transporte', '🚗', 1),
    (3, 'Entretenimiento', '🎮', 1),
    (4, 'Salud', '💊', 1),
    (5, 'Educación', '📚', 1),
    (6, 'Ropa', '👗', 1),
    (7, 'Salario', '💰', 1)
  `);
}

export async function getDatabase(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  if (!db) {
    return await initializeDatabase();
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
