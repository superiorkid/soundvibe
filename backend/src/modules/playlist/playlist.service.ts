import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import slugify from 'slugify';
import { DatabaseService } from 'src/shared/database/database.service';
import { FileUploadService } from 'src/shared/file-upload/file-upload.service';
import { PlaylistDTO } from './playlist.dto';
import { PlaylistRepository } from './playlist.repository';

@Injectable()
export class PlaylistService {
  protected readonly logger = new Logger(PlaylistService.name);

  constructor(
    private playlistRepository: PlaylistRepository,
    private fileUploadService: FileUploadService,
    private databaseService: DatabaseService,
  ) {}

  async getPlaylists(userId: string) {
    try {
      const playlists = await this.playlistRepository.findAll({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          likes: true,
        },
      });

      return {
        success: true,
        message: '',
        data: playlists,
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }

  async createPlaylist(params: { playlistDto: PlaylistDTO; userId: string }) {
    const { playlistDto, userId } = params;
    const { title, cover, description } = playlistDto;

    const slug = slugify(playlistDto.title);

    const playlistExist = await this.playlistRepository.exists({
      userId,
      slug,
    });
    if (playlistExist) throw new ConflictException('playlist already exist');

    let savedPlaylistCover: string | null = null;
    const playlistFoler = `${userId}/playlist/${slug}`;

    try {
      return await this.databaseService.$transaction(async (trx) => {
        if (cover) {
          const coverExtension = path.extname(cover?.originalName) || '.png';
          savedPlaylistCover = await this.fileUploadService.upload(
            cover.buffer,
            `${slug}-cover${coverExtension}`,
            playlistFoler,
          );
        }

        await trx.playlist.create({
          data: {
            title,
            slug,
            description,
            userId,
            coverUrl: savedPlaylistCover,
          },
        });
      });
    } catch (error) {
      if (savedPlaylistCover)
        await this.fileUploadService.remove(savedPlaylistCover);

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
}
