import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { GenreController } from './genre.controller';
import { GenreRepository } from './genre.repository';
import { GenreService } from './genre.service';

@Module({
  imports: [DatabaseModule],
  providers: [GenreRepository, GenreService],
  controllers: [GenreController],
  exports: [GenreRepository],
})
export class GenreModule {}
