import { INestApplication } from '@nestjs/common';

export async function appConfig(app: INestApplication) {
  await app.listen(process.env.PORT ?? 8000);
}
