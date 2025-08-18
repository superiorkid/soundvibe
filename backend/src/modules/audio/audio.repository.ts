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
  Prisma.AudioOrderByWithRelationInput
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.audio);
  }

  async findByTitle(title: string): Promise<Audio | null> {
    return this.delegate.findFirst({ where: { title } });
  }
}
