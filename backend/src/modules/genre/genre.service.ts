import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AudioRepository } from '../audio/audio.repository';
import { PlaylistRepository } from '../playlist/playlist.repository';
import { GenreDTO } from './dto/genre.dto';
import { GenreRepository } from './genre.repository';

@Injectable()
export class GenreService {
  protected readonly logger = new Logger(GenreService.name);

  constructor(
    private genreRepository: GenreRepository,
    private audioRepository: AudioRepository,
    private playlstRepository: PlaylistRepository,
  ) {}

  async createGenre(genreDto: GenreDTO) {
    const name = genreDto.name;
    const genreExist = await this.genreRepository.exists({ name });
    if (genreExist) throw new ConflictException('Genre already exists');

    try {
      await this.genreRepository.create({ data: { name } });
      return {
        success: true,
        message: 'Genre created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create genre :: ${(error as Error).message}`,
      );
    }
  }

  async getAll() {
    try {
      const genres = await this.genreRepository.findAll({
        orderBy: { createdAt: 'desc' },
      });
      return {
        success: true,
        message: 'Genres fetched successfully',
        data: genres,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch genres :: ${(error as Error).message}`,
      );
    }
  }

  async detailGenre(id: string) {
    try {
      const genre = await this.genreRepository.findOne({ where: { id } });
      if (!genre) throw new NotFoundException('Genre not found');
      return {
        success: true,
        message: 'Genre fetched successfully',
        data: genre,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch genre :: ${(error as Error).message}`,
      );
    }
  }

  async editGenre(params: { id: string; genreDto: GenreDTO }) {
    const { id, genreDto } = params;

    const genreExist = await this.genreRepository.exists({ id });
    if (!genreExist) throw new NotFoundException('Genre not found');

    try {
      await this.genreRepository.update({
        where: { id },
        data: { name: genreDto.name },
      });
      return {
        success: true,
        message: 'Genre updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update genre :: ${(error as Error).message}`,
      );
    }
  }

  async deleteGenre(id: string) {
    const genreExist = await this.genreRepository.exists({ id });
    if (!genreExist) throw new NotFoundException('Genre not found');

    try {
      await this.genreRepository.delete({ where: { id } });
      return {
        success: true,
        message: 'Genre deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete genre :: ${(error as Error).message}`,
      );
    }
  }
  async getLatestTracksByGenre(params: { name: string; limit: number }) {
    const { limit, name } = params;
    const genre = await this.genreRepository.findOne({
      where: { name },
    });
    if (!genre) throw new NotFoundException('genre not found');

    try {
      const tracks = await this.audioRepository.findAll({
        where: { genreId: genre.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          audioFile: true,
          user: { include: { followers: true, following: true } },
          genre: true,
          tags: true,
          coverFile: true,
          likes: { include: { user: true } },
          reposts: true,
          comments: true,
        },
      });

      const tracksMapped = tracks.map((track) => ({
        ...track,
        streamUrl: `/api/v1/audio/stream/${track.id}`,
      }));

      return {
        success: true,
        message: 'get latest tracks by genre successfully',
        data: tracksMapped,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get tracks by genre :: ${(error as Error).message}`,
      );
    }
  }

  async getPopularTracksByGenre(params: { name: string; limit: number }) {
    const { limit, name } = params;
    const genre = await this.genreRepository.findOne({
      where: { name },
    });
    if (!genre) throw new NotFoundException('genre not found');

    try {
      const tracks = await this.audioRepository.findAll({
        where: { genreId: genre.id },
        orderBy: { likesCount: 'desc' },
        take: limit,
        include: {
          audioFile: true,
          user: { include: { followers: true, following: true } },
          genre: true,
          tags: true,
          coverFile: true,
          likes: { include: { user: true } },
          reposts: true,
          comments: true,
        },
      });

      const tracksMapped = tracks.map((track) => ({
        ...track,
        streamUrl: `/api/v1/audio/stream/${track.id}`,
      }));

      return {
        success: true,
        message: 'get popular tracks by genre successfully',
        data: tracksMapped,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get tracks by genre :: ${(error as Error).message}`,
      );
    }
  }

  async getPlaylistsByGenre(params: { name: string; limit: number }) {
    const { limit, name } = params;
    const genre = await this.genreRepository.findOne({
      where: { name },
    });
    if (!genre) throw new NotFoundException('genre not found');

    try {
      const playlists = await this.playlstRepository.findAll({
        where: {
          audios: { some: { audio: { genreId: genre.id } } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          playlistCoverFile: true,
          likes: { include: { user: true } },
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

      const playlistsMapped = playlists.map((playlist) => ({
        ...playlist,
        audios: playlist.audios.map((playlistAudio) => ({
          ...playlistAudio,
          audio: {
            ...playlistAudio.audio,
            streamUrl: `/api/v1/audio/stream/${playlistAudio.audio.id}`,
          },
        })),
      }));

      return {
        success: true,
        message: 'get playlists by genre successfully',
        data: playlistsMapped,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get tracks by genre :: ${(error as Error).message}`,
      );
    }
  }
}
