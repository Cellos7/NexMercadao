let pool;

export async function getPool() {
  if (!pool) {
    const { Pool } = await import("pg");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  return pool;
}

export async function executarQuery(sql, params = []) {
  const conexao = await getPool();
  const resultado = await conexao.query(sql, params);
  return resultado;
}
