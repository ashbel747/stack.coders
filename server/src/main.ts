import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields
      forbidNonWhitelisted: true, // throws error for unexpected fields
      transform: true, // automatically transforms types to DTO types
    }),
  );

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',        // for local development
      'https://stack-coders.vercel.app/',        //for deployed frontend
    ],
  });

  // Get Mongoose connection after Nest bootstraps
  const connection = app.get<Connection>(getConnectionToken());

  if (connection.readyState === 1) {
    Logger.log('🚀 MongoDB already connected', 'Database');
  }

  connection.on('connected', () => {
    Logger.log('😀 MongoDB connected', 'Database');
  });

  connection.on('error', (err) => {
    Logger.error(`😔 MongoDB connection error: ${err}`, '', 'Database');
  });

  connection.on('disconnected', () => {
    Logger.warn('⚠️ MongoDB disconnected', 'Database');
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
