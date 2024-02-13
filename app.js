import 'dotenv/config';
import path from 'path';
import AutoLoad from '@fastify/autoload';
import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pass --options via CLI arguments in command to enable these options.
export const options = {};

export default async function (fastify, opts) {
  fastify.register(Swagger, {
    openapi: {
      info: {
        title: 'Lumina Solar API',
        description: 'Provides access to the Lumina Solar API',
        version: '1.0',
      },
    },
    refResolver: {
      buildLocalReference: (json, _baseUri, _fragment, _i) => {
        return json.$id || `def-{i}`;
      },
    },
  });

  fastify.register(SwaggerUI, {
    routePrefix: '/api-docs',
  });

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts),
  });
}
