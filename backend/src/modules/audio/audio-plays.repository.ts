import { Injectable } from '@nestjs/common';
import { AudioPlay, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class AudioPlaysRepository extends BaseRepository<
  AudioPlay,
  Prisma.AudioPlayDelegate,
  Prisma.AudioPlayWhereUniqueInput,
  Prisma.AudioPlayWhereInput,
  Prisma.AudioPlayCreateInput,
  Prisma.AudioPlayUpdateInput,
  Prisma.AudioPlayOrderByWithRelationInput,
  Prisma.AudioPlayInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.audioPlay);
  }

  async groupBy<T extends Prisma.AudioPlayGroupByArgs>(
    args: T,
  ): Promise<Prisma.GetAudioPlayGroupByPayload<T>> {
    // @ts-expect-error - error
    return this.delegate.groupBy(args);
  }
}
