import { Injectable } from '@nestjs/common';
import { PlaylistAudio, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/base/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class PlaylistAudioRepository extends BaseRepository<
  PlaylistAudio,
  Prisma.PlaylistAudioDelegate,
  Prisma.PlaylistAudioWhereUniqueInput,
  Prisma.PlaylistAudioWhereInput,
  Prisma.PlaylistAudioCreateInput,
  Prisma.PlaylistAudioUpdateInput,
  Prisma.PlaylistAudioOrderByWithRelationInput,
  Prisma.PlaylistAudioInclude
> {
  constructor(prisma: DatabaseService) {
    super(prisma, prisma.playlistAudio);
  }
}
