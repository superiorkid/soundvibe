import { Injectable } from '@nestjs/common';
import { Audio, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class AudioRepository extends BaseRepository<
  Audio,
  DatabaseService['audio'],
  Prisma.AudioWhereUniqueInput,
  Prisma.AudioWhereInput,
  Prisma.AudioCreateInput,
  Prisma.AudioUpdateInput,
  Prisma.AudioOrderByWithRelationInput,
  Prisma.AudioInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.audio);
  }

  // async findOneBySlug(slug: string): Promise<Audio | null> {
  //   return this.delegate.findFirst({ where: { slug } });
  // }

  // async findManyByUserId(userId: string): Promise<Audio[]> {
  //   return this.delegate.findMany({ where: { userId } });
  // }
}
