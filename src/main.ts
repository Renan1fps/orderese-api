import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-exception.filter';

async function bootstrap() {
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
    origin: process.env.CORS_ORIGIN ?? '*',
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
