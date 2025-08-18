import { INestApplication, ValidationPipe } from '@nestjs/common';

export async function appConfig(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // Transform is recomended configuration for avoind issues with arrays of files transformations
  await app.listen(process.env.PORT ?? 8000);
}
