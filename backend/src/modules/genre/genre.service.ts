import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GenreDTO } from './dto/genre.dto';
import { GenreRepository } from './genre.repository';

@Injectable()
export class GenreService {
  protected readonly logger = new Logger(GenreService.name);

  constructor(private genreRepository: GenreRepository) {}

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
}
