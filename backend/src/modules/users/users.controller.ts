import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('username/:username')
  async getUserByUsername(@Param('username') username: string) {
    console.log('username', username);

    return this.usersService.findOneByUsername(username);
  }
}
