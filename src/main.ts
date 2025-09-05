import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            
      forbidNonWhitelisted: true, 
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'https://games-frontend-n8ek.vercel.app', 
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend escuchando en puerto ${port}`);
}

bootstrap();