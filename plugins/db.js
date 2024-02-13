import fp from 'fastify-plugin';
import pg from 'pg';

const { Pool } = pg;

export default fp(async (fastify) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  fastify.decorate('db', {
    query: (text, params) => pool.query(text, params),
  });
});
