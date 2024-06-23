/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import path from 'path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

const assetsPath = path.join(__dirname, 'assets');
const protoPath = path.join(assetsPath, 'proto', 'app.proto');

async function bootstrapHttp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent
    allowedHeaders: 'Content-Type, Accept', // Specify allowed headers
  });

  await app.listen(3000);
}

async function bootstrapRrpc() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'app',
        protoPath: protoPath,
        url: '0.0.0.0:5454',
      },
    }
  );
  await app.listen();
}

bootstrapRrpc();
bootstrapHttp();
