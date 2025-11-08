import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para o frontend React Native
  app.enableCors({
    origin: '*', // Em produção, especificar domínios permitidos
    credentials: true,
  });

  // Validação global com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas
      forbidNonWhitelisted: true, // Retorna erro se propriedades extras forem enviadas
      transform: true, // Transforma payloads em DTOs
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Backend rodando na porta ${process.env.PORT ?? 3000}`);
}
bootstrap();
