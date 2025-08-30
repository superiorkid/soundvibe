import { Injectable } from '@nestjs/common';
import { ListeningHistory, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class ListeningHistoryRepository extends BaseRepository<
  ListeningHistory,
  Prisma.ListeningHistoryDelegate,
  Prisma.ListeningHistoryWhereUniqueInput,
  Prisma.ListeningHistoryWhereInput,
  Prisma.ListeningHistoryCreateInput,
  Prisma.ListeningHistoryUpdateInput,
  Prisma.ListeningHistoryOrderByWithRelationInput,
  Prisma.ListeningHistoryInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.listeningHistory);
  }

  async deleteMany(
    args?: Prisma.ListeningHistoryDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    return await this.delegate.deleteMany(args);
  }

  async findAll<T extends Prisma.ListeningHistoryFindManyArgs>(
    args?: T,
  ): Promise<Prisma.ListeningHistoryGetPayload<T>[]> {
    // @ts-expect-error - error
    return await this.delegate.findMany(args);
  }
}
