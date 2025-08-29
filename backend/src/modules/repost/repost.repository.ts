import { Injectable } from '@nestjs/common';
import { Comment, Prisma, Repost } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class RepostRepository extends BaseRepository<
  Repost,
  Prisma.RepostDelegate,
  Prisma.RepostWhereUniqueInput,
  Prisma.RepostWhereInput,
  Prisma.RepostCreateInput,
  Prisma.RepostUpdateInput,
  Prisma.RepostOrderByWithRelationInput,
  Prisma.RepostInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.repost);
  }

  async findAll<T extends Prisma.RepostFindManyArgs>(
    args?: T,
  ): Promise<Prisma.RepostGetPayload<T>[]> {
    // @ts-expect-error - error
    return await this.delegate.findMany(args);
  }
}
