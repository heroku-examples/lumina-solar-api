export const systemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    address: { type: 'string' },
  },
  required: ['address'],
};

export const metricSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    system_id: { type: 'string', format: 'uuid' },
    energy_produced: { type: 'number' },
    energy_consumed: { type: 'number' },
    datetime: { type: 'string', format: 'date-time' },
  },
  required: ['system_id', 'energy_produced', 'energy_consumed'],
};

export const errorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
  required: ['statusCode', 'error', 'message'],
};
