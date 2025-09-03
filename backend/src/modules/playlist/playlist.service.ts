import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import slugify from 'slugify';
import { DatabaseService } from 'src/shared/database/database.service';
import { FileUploadService } from 'src/shared/file-upload/file-upload.service';
import { CreatePlaylistDTO } from './dto/create-playlist.dto';
import { PlaylistAudioRepository } from './playlist-audio.repository';
import { PlaylistLikeRepository } from './playlist-like.repository';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistFilterEnum } from 'src/common/enums/playlist-filter.enum';

@Injectable()
export class PlaylistService {
  protected readonly logger = new Logger(PlaylistService.name);

  constructor(
    private playlistRepository: PlaylistRepository,
    private playlistAudioRepository: PlaylistAudioRepository,
    private fileUploadService: FileUploadService,
    private databaseService: DatabaseService,
    private playlistLikerepository: PlaylistLikeRepository,
  ) {}

  async getPlaylists(params: {
    userId: string;
    filter: PlaylistFilterEnum;
    query?: string;
  }) {
    const { filter = PlaylistFilterEnum.all, userId, query } = params;

    try {
      const ownPlaylists = await this.playlistRepository.findAll({
        where: {
          userId,
          ...(query ? { title: { contains: query, mode: 'insensitive' } } : {}),
        },
        orderBy: { createdAt: 'desc' },
        include: {
          likes: true,
          audios: { include: { audio: { include: { coverFile: true } } } },
          user: true,
        },
      });

      const mappedOwn = ownPlaylists.map((p) => ({
        ...p,
        sortDate: p.createdAt,
      }));
      type PlaylistWithSortDate = (typeof mappedOwn)[number];

      let mappedLiked: PlaylistWithSortDate[] = [];
      if (
        filter === PlaylistFilterEnum.liked ||
        filter === PlaylistFilterEnum.all
      ) {
        const likedRows = await this.playlistLikerepository.findAll({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          include: {
            playlist: {
              include: {
                likes: true,
                audios: {
                  include: { audio: { include: { coverFile: true } } },
                },
                user: true,
              },
            },
          },
        });

        mappedLiked = likedRows.map((likeRow) => ({
          ...likeRow.playlist,
          sortDate: likeRow.createdAt,
        }));
      }

      let allPlaylists: PlaylistWithSortDate[] = [];
      if (filter === PlaylistFilterEnum.all) {
        allPlaylists = [
          ...mappedOwn,
          ...mappedLiked.filter((p) => !mappedOwn.some((op) => op.id === p.id)),
        ];
      } else if (filter === PlaylistFilterEnum.created) {
        allPlaylists = mappedOwn;
      } else if (filter === PlaylistFilterEnum.liked) {
        allPlaylists = mappedLiked;
      }

      allPlaylists.forEach((p) => {
        if (!p.sortDate) p.sortDate = p.createdAt ?? new Date();
      });
      allPlaylists.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

      const responseData = allPlaylists.map(({ sortDate, ...rest }) => rest);

      return {
        success: true as const,
        message: '',
        data: responseData,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createPlaylist(params: {
    playlistDto: CreatePlaylistDTO;
    userId: string;
  }) {
    const { playlistDto, userId } = params;
    const { title, audio, type } = playlistDto;

    const slug = slugify(playlistDto.title);

    const playlistExist = await this.playlistRepository.exists({
      userId,
      slug,
    });
    if (playlistExist) throw new ConflictException('playlist already exist');

    // let savedPlaylistCover: string | null = null;
    // const playlistFoler = `${userId}/playlist/${slug}`;

    try {
      const newPlaylist = await this.playlistRepository.create({
        data: {
          title,
          slug,
          type,
          audioCount: 1,
          user: { connect: { id: userId } },
        },
      });

      await this.playlistAudioRepository.create({
        data: {
          playlist: { connect: { id: newPlaylist.id } },
          audio: { connect: { id: audio } },
        },
      });

      return {
        success: true,
        message: 'Playlist created successfully',
        data: newPlaylist,
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException('');
    }
  }

  async detailPlaylistBySlug(slug: string) {
    try {
      const playlist = await this.playlistRepository.findOne({
        where: { slug },
        include: {
          likes: true,
          audios: true,
        },
      });

      if (!playlist) throw new NotFoundException();

      return {
        success: true,
        message: '',
        data: playlist,
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));

      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async detailPlaylist(id: string) {
    try {
      const playlist = await this.playlistRepository.findOne({
        where: { id },
        include: {
          likes: true,
          audios: true,
        },
      });

      if (!playlist) throw new NotFoundException();

      return {
        success: true,
        message: '',
        data: playlist,
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));

      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async deletePlaylist(params: { userId: string; id: string }) {
    const { id, userId } = params;

    const playlist = await this.playlistRepository.exists({ id, userId });
    if (!playlist) throw new NotFoundException();

    try {
      await this.playlistRepository.delete({ where: { id } });
      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }

  async addAudioToPlaylist(params: {
    playlistId: string;
    audioId: string;
    userId: string;
  }) {
    const { audioId, playlistId, userId } = params;
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      include: {
        audios: true,
      },
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    if (playlist.userId !== userId)
      throw new UnauthorizedException(
        'You do not have permission to modify this playlist',
      );

    const alreadyExists = playlist.audios.some((a) => a.audioId === audioId);
    if (alreadyExists)
      throw new ConflictException('Audio already exists in this playlist');

    try {
      await Promise.all([
        this.playlistAudioRepository.create({
          data: {
            playlist: { connect: { id: playlistId } },
            audio: { connect: { id: audioId } },
          },
        }),
        await this.playlistRepository.update({
          where: { id: playlistId },
          data: {
            audioCount: { increment: 1 },
          },
        }),
      ]);
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }

  async removeAudioFromPlaylist(params: {
    userId: string;
    audioId: string;
    playlistId: string;
  }) {
    const { audioId, playlistId, userId } = params;

    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      include: { audios: true },
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    if (playlist.userId !== userId)
      throw new UnauthorizedException(
        'You do not have permission to modify this playlist',
      );

    const audioInPlaylist = playlist.audios.find((a) => a.audioId === audioId);
    if (!audioInPlaylist)
      throw new NotFoundException('Audio not found in this playlist');

    try {
      await Promise.all([
        this.playlistAudioRepository.delete({
          where: { id: audioInPlaylist.id },
        }),
        this.playlistRepository.update({
          where: { id: playlistId },
          data: {
            audioCount: { decrement: 1 },
          },
        }),
      ]);

      return {
        success: true,
        message: 'Audio removed from playlist successfully',
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }
}
