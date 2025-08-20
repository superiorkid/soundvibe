import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GenreDTO } from './dto/genre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
@ApiTags('Genres')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiBody({ type: GenreDTO, description: 'Genre payload' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiConflictResponse({ description: 'Genre already exists' })
  @ApiCreatedResponse({ description: 'Genre created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async createGenre(@Body() genreDto: GenreDTO) {
    return this.genreService.createGenre(genreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of genres fetched successfully' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  async getAll() {
    return this.genreService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a genre by ID' })
  @ApiParam({ name: 'id', description: 'Genre ID' })
  @ApiNotFoundResponse({ description: 'Genre not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiOkResponse({ description: 'Genre fetched successfully' })
  async detail(@Param('id') id: string) {
    return this.genreService.detailGenre(id);
  }

  @Put(':id')
  @ApiBody({ type: GenreDTO, description: 'Genre payload' })
  @ApiOperation({ summary: 'Update a genre' })
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse({ description: 'Genre not found' })
  @ApiOkResponse({ description: 'Genre updated successfully' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiParam({ name: 'id', description: 'Genre ID' })
  async editGenre(@Param('id') id: string, @Body() genreDto: GenreDTO) {
    return this.genreService.editGenre({ id, genreDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a genre' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'Genre ID' })
  @ApiNotFoundResponse({ description: 'Genre not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiOkResponse({ description: 'Genre deleted successfully' })
  async deleteGenre(@Param('id') id: string) {
    return this.genreService.deleteGenre(id);
  }
}
