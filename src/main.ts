import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as swaggerStats from 'swagger-stats';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Cache Nest')
    .setDescription('API to manage products, stores and cached authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(
    swaggerStats.getMiddleware({
      swaggerSpec: document,
      uriPath: '/swagger-stats',
      name: 'Cache Nest API',
      version: '1.0.0',
      authentication: true,
      onAuthenticate: (req) => {
        const auth = {
          login: process.env.SWAGGER_STATS_USERNAME,
          password: process.env.SWAGGER_STATS_PASSWORD,
        };

        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = Buffer.from(b64auth, 'base64')
          .toString()
          .split(':');

        return login === auth.login && password === auth.password;
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
