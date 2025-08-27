import { Injectable } from '@nestjs/common';
import { CommentLike, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class CommentLikeRepository extends BaseRepository<
  CommentLike,
  Prisma.CommentLikeDelegate,
  Prisma.CommentLikeWhereUniqueInput,
  Prisma.CommentLikeWhereInput,
  Prisma.CommentLikeCreateInput,
  Prisma.CommentLikeUpdateInput,
  Prisma.CommentLikeOrderByWithRelationInput,
  Prisma.CommentLikeInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.commentLike);
  }
}
