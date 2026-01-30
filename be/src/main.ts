import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as timeout from 'connect-timeout';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Request timeout (30 seconds)
  app.use(timeout('30s'));
  
  // Security headers with Helmet
  app.use(helmet());
  
  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true, // Convert primitive types automatically
    },
  }));
  
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });


  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`GraphQL endpoint: http://localhost:${process.env.PORT ?? 3000}/graphql`);


}
bootstrap();
