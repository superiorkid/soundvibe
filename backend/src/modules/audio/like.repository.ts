import { Injectable } from '@nestjs/common';
import { Like, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class LikeRepository extends BaseRepository<
  Like,
  Prisma.LikeDelegate,
  Prisma.LikeWhereUniqueInput,
  Prisma.LikeWhereInput,
  Prisma.LikeCreateInput,
  Prisma.LikeUpdateInput,
  Prisma.LikeOrderByWithRelationInput,
  Prisma.LikeInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.like);
  }

  async findOne<T extends Prisma.LikeFindFirstArgs>(
    args: T,
  ): Promise<Prisma.LikeGetPayload<T> | null> {
    // @ts-expect-error - error
    return await this.delegate.findUnique(args);
  }

  async findAll<T extends Prisma.LikeFindManyArgs>(
    args?: T,
  ): Promise<Prisma.LikeGetPayload<T>[]> {
    // @ts-expect-error - error
    return await this.delegate.findMany(args);
  }
}
