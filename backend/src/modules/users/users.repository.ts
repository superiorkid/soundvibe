import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class UsersRepository extends BaseRepository<
  User,
  Prisma.UserDelegate,
  Prisma.UserWhereUniqueInput,
  Prisma.UserWhereInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserOrderByWithRelationInput,
  Prisma.UserInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.user);
  }

  async findOne<T extends Prisma.UserFindFirstArgs>(
    args: T,
  ): Promise<Prisma.UserGetPayload<T> | null> {
    // @ts-expect-error - error
    return await this.delegate.findFirst(args);
  }

  async findAll<T extends Prisma.UserFindManyArgs>(
    args?: T,
  ): Promise<Prisma.UserGetPayload<T>[]> {
    // @ts-expect-error - error
    return await this.delegate.findMany(args);
  }
}
