import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  providers: [],
  controllers: [UsersController],
})
export class UsersModule {}
