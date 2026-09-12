import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from '@shared/infrastructure/filters/domain-exception.filter';
import { AppDataSource } from "@shared/infrastructure/database/data-source";

async function bootstrap() {

  console.info('Running migrations');

  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  console.info('Migrations run successfully');



  const app = await NestFactory.create(AppModule, {
    rawBody: true, // needed for Stripe webhook signature verification
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new DomainExceptionFilter());

  app.enableCors({
    origin: ['http://localhost:8080', 'https://order-ease-glow.lovable.app', 'https://order-ease-glow-production.up.railway.app'],
    credentials: true,
  });


  const swaggerConfig = new DocumentBuilder()
    .setTitle('OrderEase API')
    .setDescription('SaaS white-label para gestão de pedidos em restaurantes, padarias e quiosques')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`OrderEase API running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
