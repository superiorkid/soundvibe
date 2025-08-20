import { Injectable } from '@nestjs/common';
import { Genre, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class GenreRepository extends BaseRepository<
  Genre,
  DatabaseService['genre'],
  Prisma.GenreWhereUniqueInput,
  Prisma.GenreWhereInput,
  Prisma.GenreCreateInput,
  Prisma.GenreUpdateInput,
  Prisma.GenreOrderByWithRelationInput,
  Prisma.GenreInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.genre);
  }
}
