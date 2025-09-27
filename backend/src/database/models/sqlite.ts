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
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')) DEFAULT 'expense',
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Verificar si la columna type existe, si no, agregarla
  const tableInfo = await db.all("PRAGMA table_info(categories)");
  const hasTypeColumn = tableInfo.some((column: any) => column.name === 'type');
  
  if (!hasTypeColumn) {
    await db.exec(`
      ALTER TABLE categories 
      ADD COLUMN type TEXT NOT NULL CHECK (type IN ('income', 'expense')) DEFAULT 'expense'
    `);
  }

  // Tabla de movimientos (gastos/ingresos) simplificada
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('gasto', 'entrada')),
      category_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Migración: convertir amounts existentes de REAL a INTEGER
  try {
    const tableInfo = await db.all("PRAGMA table_info(movements)");
    const amountColumn = tableInfo.find((column: any) => column.name === 'amount');
    
    if (amountColumn && amountColumn.type === 'REAL') {
      // Crear tabla temporal con el nuevo esquema
      await db.exec(`
        CREATE TABLE movements_temp (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount INTEGER NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('gasto', 'entrada')),
          category_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Copiar datos convirtiendo amounts a enteros
      await db.exec(`
        INSERT INTO movements_temp (id, amount, type, category_id, user_id, date, created_at)
        SELECT id, ROUND(amount), type, category_id, user_id, date, created_at FROM movements
      `);
      
      // Eliminar tabla original y renombrar la temporal
      await db.exec(`DROP TABLE movements`);
      await db.exec(`ALTER TABLE movements_temp RENAME TO movements`);
    }
  } catch (error) {
    console.log('Migration for amount type already completed or not needed');
  }

  // Inicializar categorías predeterminadas para usuarios existentes que no las tienen
  try {
    await initializeDefaultCategoriesForExistingUsers();
  } catch (error) {
    console.log('Error initializing default categories:', error);
  }
}

// Función para crear categorías básicas para un usuario específico
export async function createDefaultCategoriesForUser(userId: number): Promise<void> {
  const db = await getDatabase();
  
  // Definir las categorías predeterminadas
  const defaultCategories = [
    { name: 'Salario', emoji: '💰', type: 'income' },
    { name: 'Inversión', emoji: '📈', type: 'income' },
    { name: 'Alimento', emoji: '🍔', type: 'expense' },
    { name: 'Transporte', emoji: '🚗', type: 'expense' },
    { name: 'Servicios Básicos', emoji: '⚡', type: 'expense' },
    { name: 'Ropa', emoji: '👗', type: 'expense' },
    { name: 'Salud', emoji: '💊', type: 'expense' }
  ];
  
  // Verificar e insertar solo las categorías que no existan
  let categoriesAdded = 0;
  
  for (const category of defaultCategories) {
    // Verificar si esta categoría específica ya existe
    const existingCategory = await db.get(
      'SELECT id FROM categories WHERE user_id = ? AND name = ? AND type = ?', 
      [userId, category.name, category.type]
    );
    
    // Solo crear si no existe
    if (!existingCategory) {
      await db.run(
        'INSERT INTO categories (name, emoji, type, user_id) VALUES (?, ?, ?, ?)',
        [category.name, category.emoji, category.type, userId]
      );
      categoriesAdded++;
    }
  }
  
  console.log(`${categoriesAdded} categorías predeterminadas creadas para el usuario ${userId}`);
}

// Función para inicializar categorías para usuarios existentes que no las tienen
export async function initializeDefaultCategoriesForExistingUsers(): Promise<void> {
  const db = await getDatabase();
  
  // Obtener todos los usuarios que no tienen categorías
  const usersWithoutCategories = await db.all(`
    SELECT u.id, u.username 
    FROM users u 
    LEFT JOIN categories c ON u.id = c.user_id 
    GROUP BY u.id, u.username 
    HAVING COUNT(c.id) = 0
  `);
  
  console.log(`Encontrados ${usersWithoutCategories.length} usuarios sin categorías predeterminadas`);
  
  // Crear categorías predeterminadas para cada usuario que no las tenga
  for (const user of usersWithoutCategories) {
    await createDefaultCategoriesForUser(user.id);
  }
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
