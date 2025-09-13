import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@Controller({ version: '1', path: 'search' })
@ApiTags('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async searchEverything(
    @Query('keyword') keyword: string,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ) {
    return this.searchService.searchEverythng({ keyword, limit });
  }
}
