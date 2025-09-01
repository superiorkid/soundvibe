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
}
