import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

export async function appConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  ); // Transform is recomended configuration for avoind issues with arrays of files transformations

  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 8000);
}
