import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async findOneByUsername(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { displayUsername: username },
      });
      if (!user) throw new NotFoundException();
      return {
        success: true,
        message: '',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('');
    }
  }
}
