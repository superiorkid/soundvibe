import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsersRepository, UsersService],
  controllers: [UsersController],
  exports: [UsersRepository],
})
export class UsersModule {}
