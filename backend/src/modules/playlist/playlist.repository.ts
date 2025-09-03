import { Injectable } from '@nestjs/common';
import { Playlist, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class PlaylistRepository extends BaseRepository<
  Playlist,
  Prisma.PlaylistDelegate,
  Prisma.PlaylistWhereUniqueInput,
  Prisma.PlaylistWhereInput,
  Prisma.PlaylistCreateInput,
  Prisma.PlaylistUpdateInput,
  Prisma.PlaylistOrderByWithRelationInput,
  Prisma.PlaylistInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.playlist);
  }

  async findOne<T extends Prisma.PlaylistFindFirstArgs>(
    args: T,
  ): Promise<Prisma.PlaylistGetPayload<T> | null> {
    // @ts-expect-error - error
    return await this.delegate.findFirst(args);
  }

  async findAll<T extends Prisma.PlaylistFindManyArgs>(
    args?: T,
  ): Promise<Prisma.PlaylistGetPayload<T>[]> {
    // @ts-expect-error - error
    return await this.delegate.findMany(args);
  }
}
