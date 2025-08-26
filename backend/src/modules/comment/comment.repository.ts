import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class CommentRepository extends BaseRepository<
  Comment,
  Prisma.CommentDelegate,
  Prisma.CommentWhereUniqueInput,
  Prisma.CommentWhereInput,
  Prisma.CommentCreateInput,
  Prisma.CommentUpdateInput,
  Prisma.CommentOrderByWithRelationInput,
  Prisma.CommentInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.comment);
  }
}
