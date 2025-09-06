import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, statSync } from 'node:fs';
import path, { join } from 'node:path';
import slugify from 'slugify';
import { PlaylistFilterEnum } from 'src/common/enums/playlist-filter.enum';
import { FileUploadService } from 'src/shared/file-upload/file-upload.service';
import { CreatePlaylistDTO } from './dto/create-playlist.dto';
import { UpdatePlaylistDTO } from './dto/update-playlist.dto';
import { PlaylistAudioRepository } from './playlist-audio.repository';
import { PlaylistCoverFileRepository } from './playlist-cover-file.repository';
import { PlaylistLikeRepository } from './playlist-like.repository';
import { PlaylistRepository } from './playlist.repository';

@Injectable()
export class PlaylistService {
  protected readonly logger = new Logger(PlaylistService.name);

  constructor(
    private playlistRepository: PlaylistRepository,
    private playlistAudioRepository: PlaylistAudioRepository,
    private playlistLikerepository: PlaylistLikeRepository,
    private playlistCoverFileRepository: PlaylistCoverFileRepository,
    private fileUploadService: FileUploadService,
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

  async getCover(params: { id: string; res: Response }) {
    const { id, res } = params;

    const playlist = await this.playlistRepository.findOne({
      where: { id },
      include: { playlistCoverFile: true },
    });
    if (!playlist || !playlist.playlistCoverFile)
      throw new NotFoundException('Cover not found.');

    const filePath = join(
      process.cwd(),
      'public',
      playlist.playlistCoverFile.url,
    );

    try {
      const stat = statSync(filePath);
      const fileSize = stat.size;

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'no-cache',
      });

      createReadStream(filePath).pipe(res);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('cover file not accessible');
    }
  }

  async updatePlaylist(params: {
    userId: string;
    id: string;
    updatePlaylistDTO: UpdatePlaylistDTO;
  }) {
    const { id, updatePlaylistDTO, userId } = params;

    const playlist = await this.playlistRepository.findOne({
      where: { id },
      include: { playlistCoverFile: true },
    });
    if (!playlist) throw new NotFoundException('');
    if (playlist.userId !== userId)
      throw new ForbiddenException('You cannot update this playlist');

    try {
      if (updatePlaylistDTO.coverFile) {
        // check if has remove
        if (playlist.playlistCoverFile) {
          // remove from local drive
          await this.fileUploadService.remove(playlist.playlistCoverFile.url);
          // remove from db
          await this.playlistCoverFileRepository.delete({
            where: { playlistId: id },
          });
        }

        const playlistFolder = `${userId}/playlist/${playlist.slug}`;
        const coverExtension =
          path.extname(updatePlaylistDTO.coverFile.originalName) || '.png';
        const savedPlaylistCover = await this.fileUploadService.upload(
          updatePlaylistDTO.coverFile.buffer,
          `${playlist.slug}${coverExtension}`,
          playlistFolder,
        );
        await this.playlistCoverFileRepository.create({
          data: {
            url: savedPlaylistCover,
            alt: `${playlist.title} cover`,
            playlist: { connect: { id } },
          },
        });
      }

      await this.playlistRepository.update({
        where: { id },
        data: {
          title: updatePlaylistDTO.title,
          description: updatePlaylistDTO.description,
          type: updatePlaylistDTO.type,
        },
      });

      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException('');
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
          playlistCoverFile: true,
          likes: true,
          audios: {
            include: {
              audio: {
                include: {
                  audioFile: true,
                  coverFile: true,
                  genre: true,
                  user: true,
                  likes: { include: { user: true } },
                  reposts: { include: { user: true } },
                },
              },
            },
          },
          user: true,
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

  async likePlaylist(params: { playlistId: string; userId: string }) {
    const { playlistId, userId } = params;

    const playlistExist = await this.playlistRepository.exists({
      id: playlistId,
    });
    if (!playlistExist) throw new NotFoundException('');

    const alreadyLikePlaylist = await this.playlistLikerepository.exists({
      id: playlistId,
      userId,
    });
    if (alreadyLikePlaylist) throw new ConflictException('');

    try {
      await Promise.all([
        this.playlistLikerepository.create({
          data: {
            playlist: { connect: { id: playlistId } },
            user: { connect: { id: userId } },
          },
        }),
        this.playlistRepository.update({
          where: { id: playlistId },
          data: { likeCount: { increment: 1 } },
        }),
      ]);

      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }

  async unlikePlaylist(params: { playlistId: string; userId: string }) {
    const { playlistId, userId } = params;

    const playlistExist = await this.playlistRepository.exists({
      id: playlistId,
    });
    if (!playlistExist) throw new NotFoundException('');

    const alreadyLikePlaylist = await this.playlistLikerepository.findOne({
      where: {
        playlistId,
        userId,
      },
    });
    if (!alreadyLikePlaylist) throw new NotFoundException('');

    try {
      await Promise.all([
        this.playlistLikerepository.delete({
          where: { playlistId_userId: { playlistId, userId } },
        }),
        this.playlistRepository.update({
          where: { id: playlistId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);

      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }
}
