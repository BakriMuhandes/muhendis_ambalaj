import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set your global prefix
  app.setGlobalPrefix('api/v1');

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Muhendis Ambalaj API')
    .setDescription('API documentation for backend services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  // Bind to 0.0.0.0 for Railway
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();