import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT || 3000;
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://downtime00.github.io'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 쿠키 및 인증 헤더 포함 여부
  });
  app.enableVersioning({
    type: VersioningType.URI,
    //prefix: '',// 'v' 생략
    defaultVersion: [VERSION_NEUTRAL, '', '1', '2'],

  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: process.env.ENV_MODE === "dev"
        ? false
        : true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  console.log(`Server Start!  port:${port}`)
  await app.listen(port);
}
bootstrap();
