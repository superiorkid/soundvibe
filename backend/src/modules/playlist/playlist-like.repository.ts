import { Injectable } from '@nestjs/common';
import { PlaylistLike, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class PlaylistLikeRepository extends BaseRepository<
  PlaylistLike,
  Prisma.PlaylistLikeDelegate,
  Prisma.PlaylistLikeWhereUniqueInput,
  Prisma.PlaylistLikeWhereInput,
  Prisma.PlaylistLikeCreateInput,
  Prisma.PlaylistLikeUpdateInput,
  Prisma.PlaylistLikeOrderByWithRelationInput,
  Prisma.PlaylistLikeInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.playlistLike);
  }

  async findOne<T extends Prisma.PlaylistLikeFindFirstArgs>(
    args: T,
  ): Promise<Prisma.PlaylistLikeGetPayload<T> | null> {
    // @ts-expect-error - error
    return await this.delegate.findFirst(args);
  }

  async findAll<T extends Prisma.PlaylistLikeFindManyArgs>(
    args?: T,
  ): Promise<Prisma.PlaylistLikeGetPayload<T>[]> {
    // @ts-expect-error - error
    return await this.delegate.findMany(args);
  }
}
