import { Injectable } from '@nestjs/common';
import { Follow, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class FollowRepository extends BaseRepository<
  Follow,
  Prisma.FollowDelegate,
  Prisma.FollowWhereUniqueInput,
  Prisma.FollowWhereInput,
  Prisma.FollowCreateInput,
  Prisma.FollowUpdateInput,
  Prisma.FollowOrderByWithRelationInput,
  Prisma.FollowInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.follow);
  }
}
