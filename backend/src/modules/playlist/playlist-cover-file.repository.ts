import { Injectable } from '@nestjs/common';
import { PlaylistCoverFile, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class PlaylistCoverFileRepository extends BaseRepository<
  PlaylistCoverFile,
  Prisma.PlaylistCoverFileDelegate,
  Prisma.PlaylistCoverFileWhereUniqueInput,
  Prisma.PlaylistCoverFileWhereInput,
  Prisma.PlaylistCoverFileCreateInput,
  Prisma.PlaylistCoverFileUpdateInput,
  Prisma.PlaylistCoverFileOrderByWithRelationInput,
  Prisma.PlaylistCoverFileInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.playlistCoverFile);
  }
}
