import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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

@Controller({ version: '1', path: 'genres' })
@ApiTags('genres')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({})
  @ApiBody({ type: GenreDTO, description: '' })
  @ApiInternalServerErrorResponse({ description: '' })
  @ApiConflictResponse({ description: '' })
  @ApiCreatedResponse({ description: '' })
  @ApiBadRequestResponse({ description: '' })
  async createGenre(@Body() genreDto: GenreDTO) {
    return this.genreService.createGenre(genreDto);
  }

  @Get()
  @ApiOperation({})
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '' })
  @ApiInternalServerErrorResponse({ description: '' })
  async getAll() {
    return this.genreService.getAll();
  }

  @Get('/name/:name/latest')
  @ApiOperation({
    summary: 'Get latest tracks by genre',
    description:
      'Retrieve the most recently uploaded tracks that belong to a specific genre.',
  })
  async getLatestTracksByGenre(
    @Param('name') name: string,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ) {
    return this.genreService.getLatestTracksByGenre({ name, limit });
  }

  @Get('/name/:name/popular')
  @ApiOperation({
    summary: 'Get popular tracks by genre',
    description:
      'Retrieve the most popular tracks based on likes, plays, or other metrics within a specific genre.',
  })
  async getPopularTracksByGenre(
    @Param('name') name: string,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ) {
    return this.genreService.getPopularTracksByGenre({ name, limit });
  }

  @Get('/name/:name/playlists')
  @ApiOperation({
    summary: 'Get playlists by genre',
    description:
      'Retrieve playlists that include tracks belonging to a specific genre.',
  })
  async getPlaylistsByGenre(
    @Param('name') name: string,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ) {
    return this.genreService.getPlaylistsByGenre({ name, limit });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({})
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: '' })
  @ApiInternalServerErrorResponse({ description: '' })
  @ApiOkResponse({ description: '' })
  async detail(@Param('id') id: string) {
    return this.genreService.detailGenre(id);
  }

  @Put(':id')
  @ApiBody({ type: GenreDTO })
  @ApiOperation({})
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse({ description: '' })
  @ApiOkResponse({ description: '' })
  @ApiInternalServerErrorResponse({ description: '' })
  @ApiParam({ name: 'id' })
  async editGenre(@Param('id') id: string, @Body() genreDto: GenreDTO) {
    return this.genreService.editGenre({ id, genreDto });
  }

  @Delete(':id')
  @ApiOperation({})
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ description: '' })
  @ApiInternalServerErrorResponse({ description: '' })
  @ApiOkResponse({ description: '' })
  async deleteGenre(@Param('id') id: string) {
    return this.genreService.deleteGenre(id);
  }
}
