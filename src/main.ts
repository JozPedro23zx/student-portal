import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DomainValidationFilter } from './modules/@shared/filters/domain-validation/domain-validation.filter';
import { NotFoundFilter } from './modules/@shared/filters/not-found/not-found.filter';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'erros-queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new DomainValidationFilter(),
    new NotFoundFilter()
  )

  await app.listen(3000);
}
bootstrap();
