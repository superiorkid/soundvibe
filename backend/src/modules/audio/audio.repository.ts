import { Injectable } from '@nestjs/common';
import { Audio, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class AudioRepository extends BaseRepository<
  Audio,
  Prisma.AudioDelegate,
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

  async findOne<T extends Prisma.AudioFindUniqueArgs>(
    args: T,
  ): Promise<Prisma.AudioGetPayload<T> | null> {
    // @ts-expect-error - error
    return await this.delegate.findFirst(args);
  }

  async findAll<T extends Prisma.AudioFindManyArgs>(
    args?: T,
  ): Promise<Prisma.AudioGetPayload<T>[]> {
    // @ts-expect-error - error
    return await this.delegate.findMany(args);
  }
}
