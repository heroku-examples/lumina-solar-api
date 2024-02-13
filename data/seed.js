import 'dotenv/config';
import { faker } from '@faker-js/faker';
import pg from 'pg';
const { Pool } = pg;

const SYSTEM_COUNT = 5;
const METRIC_COUNT = 24 * 5; // 24 metrics per day for 10 days

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Cleanup existing data
  await pool.query('DELETE FROM metrics');
  await pool.query('DELETE FROM systems');

  const systemIds = [];
  // Seed systems
  for (let i = 0; i < SYSTEM_COUNT; i++) {
    const address =
      faker.location.streetAddress() +
      ', ' +
      faker.location.city() +
      ', ' +
      faker.location.state();
    const system = await pool.query(
      `INSERT INTO systems (address) VALUES ($1) RETURNING id`,
      [address]
    );
    systemIds.push(system.rows[0].id);
  }

  // Seed metrics
  for (let i = 0; i < systemIds.length; i++) {
    console.log('Seeding system', i + 1, 'of', systemIds.length);
    for (let j = 0; j < METRIC_COUNT; j++) {
      let date = new Date(Date.now() - j * 3600 * 1000);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      await pool.query(
        `INSERT INTO metrics (system_id, datetime, energy_produced, energy_consumed) VALUES ($1, $2, $3, $4)`,
        [
          systemIds[i],
          date,
          faker.number.float({ min: 0, max: 25, fractionDigits: 2 }),
          faker.number.float({ min: 0, max: 20, fractionDigits: 2 }),
        ]
      );
    }
  }
}

seed()
  .then(() => {
    console.log('Database seeded.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
