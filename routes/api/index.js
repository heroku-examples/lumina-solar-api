import {
  systemSchema,
  metricSchema,
  errorSchema,
  summarySchema,
} from '../../schemas/index.js';

export default async function (fastify, _opts) {
  fastify.addSchema({
    $id: 'system',
    ...systemSchema,
  });

  fastify.addSchema({
    $id: 'metric',
    ...metricSchema,
  });

  fastify.addSchema({
    $id: 'summary',
    ...summarySchema,
  });

  fastify.addSchema({
    $id: 'error',
    ...errorSchema,
  });

  fastify.get(
    '/systems',
    {
      schema: {
        description: 'Get all systems',
        tags: ['systems'],
        response: {
          200: {
            description: 'All registered systems',
            type: 'array',
            items: { $ref: 'system#' },
          },
          500: {
            description: 'Internal Server Error',
            $ref: 'error#',
          },
        },
      },
    },
    async function (_request, reply) {
      const { db } = fastify;
      const { rows } = await db.query('SELECT id, address FROM systems');
      reply.send(rows);
    }
  );

  fastify.get(
    '/metrics/:systemId',
    {
      schema: {
        description: 'Get metrics for a system',
        tags: ['metrics'],
        params: {
          type: 'object',
          description: 'The system ID',
          properties: {
            systemId: { type: 'string' },
          },
        },
        querystring: {
          description: 'Filter metrics by date',
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date' },
          },
          required: ['date'],
        },
        response: {
          200: {
            description: 'Metrics for the system',
            type: 'array',
            items: { $ref: 'metric#' },
          },
          500: {
            description: 'Internal Server Error',
            $ref: 'error#',
          },
        },
      },
    },
    async function (request, reply) {
      const { date } = request.query;
      const { systemId } = request.params;
      const { db } = fastify;
      const { rows } = await db.query(
        'SELECT * FROM metrics WHERE system_id = $1 AND datetime::date = $2',
        [systemId, date]
      );
      reply.send(rows);
    }
  );

  fastify.get(
    '/summary/:systemId',
    {
      schema: {
        description: 'Get summary for a system',
        tags: ['metrics'],
        params: {
          type: 'object',
          description: 'The system ID',
          properties: {
            systemId: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Summary for the system',
            type: 'array',
            items: { $ref: 'summary#' },
          },
          500: {
            description: 'Internal Server Error',
            $ref: 'error#',
          },
        },
      },
    },
    async function (request, reply) {
      const { systemId } = request.params;
      const { db } = fastify;
      const { rows } = await db.query(
        `SELECT datetime::date as date, 
                SUM(energy_produced) as total_energy_produced, 
                SUM(energy_consumed) as total_energy_consumed 
         FROM metrics 
         WHERE system_id = $1 
         GROUP BY datetime::date
         ORDER BY datetime::date DESC`,
        [systemId]
      );
      reply.send(rows.map(x => ({
        systemid: systemId,
        summarydate: x.date,
        totalenergyproduced: x.total_energy_produced,
        totalenergyconsumed: x.total_energy_consumed
      })));
    }
  );
}
