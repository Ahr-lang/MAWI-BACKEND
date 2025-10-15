// src/scripts/init-databases.ts
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_CONF = {
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT)!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  ssl: process.env.DB_SSL === "require" ? { rejectUnauthorized: false } : false,
};

const TENANTS = {
  agromo: { database: process.env.DB_AGROMO! },
  biomo: { database: process.env.DB_BIOMO! },
  robo: { database: process.env.DB_ROBO! },
};

async function runSchemaScript(tenant: string, scriptPath: string) {
  const dbConfig = TENANTS[tenant as keyof typeof TENANTS];
  if (!dbConfig) {
    console.error(`Unknown tenant: ${tenant}`);
    return;
  }

  const pool = new Pool({
    ...BASE_CONF,
    database: dbConfig.database,
  });

  try {
    console.log(`Connecting to ${tenant} database: ${dbConfig.database}`);

    // Test connection
    await pool.query('SELECT 1');
    console.log(`✅ Connected to ${tenant} database`);

    // Read and execute schema script
    const sqlScript = fs.readFileSync(scriptPath, 'utf8');
    console.log(`📄 Executing schema script for ${tenant}...`);

    // Split script into individual statements and execute them
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (err: any) {
          // Ignore "already exists" errors
          if (!err.message.includes('already exists')) {
            console.warn(`⚠️  Warning executing statement: ${err.message}`);
          }
        }
      }
    }

    console.log(`✅ ${tenant} database schema initialized successfully`);

  } catch (error: any) {
    console.error(`❌ Error initializing ${tenant} database:`, error.message);
  } finally {
    await pool.end();
  }
}

async function initAllDatabases() {
  console.log('🚀 Initializing database schemas...\n');

  const schemasDir = path.join(__dirname, '..', 'db', 'schemas');

  for (const tenant of Object.keys(TENANTS)) {
    const scriptFile = `Script_generacion_${tenant}.sql`;
    const scriptPath = path.join(schemasDir, scriptFile);

    if (fs.existsSync(scriptPath)) {
      await runSchemaScript(tenant, scriptPath);
    } else {
      console.warn(`⚠️  Schema file not found: ${scriptFile}`);
    }
  }

  console.log('\n🎉 Database initialization complete!');
}

// Run if called directly
if (require.main === module) {
  initAllDatabases().catch(console.error);
}

export { initAllDatabases };