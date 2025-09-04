import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Crear la aplicación
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina propiedades no incluidas en los DTO
      forbidNonWhitelisted: true, // lanza error si hay propiedades extra
    }),
  );

  // Habilitar CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // desarrollo local
      'https://games-frontend-n8ek.vercel.app', // frontend en producción
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // si necesitas enviar cookies o auth
  });

  // Puerto dinámico según Railway o fallback
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend escuchando en puerto ${port}`);
}

bootstrap();