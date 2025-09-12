import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { FollowRepository } from './follow.repository';

@Injectable()
export class FollowService {
  protected readonly logger = new Logger(FollowService.name);

  constructor(
    private followRepository: FollowRepository,
    private userRepository: UsersRepository,
  ) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId)
      throw new BadRequestException('You cannot follow your self');

    const existingFollow = await this.followRepository.exists({
      followerId_followingId: { followerId, followingId },
    });
    if (existingFollow)
      throw new ConflictException('You are already following this user');

    try {
      await Promise.all([
        this.followRepository.create({
          data: {
            follower: { connect: { id: followerId } },
            following: { connect: { id: followingId } },
          },
        }),
        this.userRepository.update({
          where: { id: followerId },
          data: { followingCounts: { increment: 1 } },
        }),
        this.userRepository.update({
          where: { id: followingId },
          data: { followersCounts: { increment: 1 } },
        }),
      ]);

      return {
        success: true,
        message: 'Successfully followed the user.',
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to follow user :: ${(error as Error).message}`,
      );
    }
  }

  async unfollow(followerId: string, followingId: string) {
    if (followerId === followingId)
      throw new BadRequestException('You cannot unfollow yourself.');

    const followRecord = await this.followRepository.findOne({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (!followRecord)
      throw new NotFoundException('You are not following this user.');

    try {
      await Promise.all([
        this.followRepository.delete({ where: { id: followRecord.id } }),
        this.userRepository.update({
          where: { id: followerId },
          data: { followingCounts: { decrement: 1 } },
        }),
        this.userRepository.update({
          where: { id: followingId },
          data: { followersCounts: { decrement: 1 } },
        }),
      ]);

      return {
        success: true,
        message: 'Successfully unfollow user',
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to unfollow user :: ${(error as Error).message}`,
      );
    }
  }

  async getFollowers(userId: string) {
    const userRecord = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userRecord) throw new NotFoundException('User not found');

    try {
      const followers = await this.followRepository.findAll({
        where: { followingId: userId },
        include: { follower: true },
      });

      return {
        success: true,
        message: 'get followers successfully',
        data: followers,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to get followers :: ${(error as Error).message}`,
      );
    }
  }

  async getFollowing(params: { userId: string; filter?: string }) {
    const { userId, filter } = params;

    const userRecord = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userRecord) throw new NotFoundException('User not found');

    try {
      const following = await this.followRepository.findAll({
        where: {
          followerId: userId,
          ...(filter
            ? {
                following: {
                  OR: [
                    { name: { contains: filter, mode: 'insensitive' } },
                    { username: { contains: filter, mode: 'insensitive' } },
                    {
                      displayUsername: {
                        contains: filter,
                        mode: 'insensitive',
                      },
                    },
                  ],
                },
              }
            : {}),
        },
        include: {
          following: { include: { followers: true, following: true } },
        },
      });

      return {
        success: true,
        message: 'get following successfully',
        data: following,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to get following :: ${(error as Error).message}`,
      );
    }
  }

  async getSuggestedUsers(params: { currentUserId: string; limit: number }) {
    const { currentUserId, limit } = params;

    try {
      const suggestedUsers = await this.userRepository.findAll({
        where: {
          id: { not: currentUserId },
          followers: {
            none: { followerId: currentUserId },
          },
        },
        include: {
          followers: true,
          following: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return {
        success: true,
        message: 'get suggested users successfully',
        data: suggestedUsers,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to get suggested users :: ${(error as Error).message}`,
      );
    }
  }

  async getFollowersByUsername(username: string) {
    const userRecord = await this.userRepository.findOne({
      where: { displayUsername: username },
    });
    if (!userRecord) throw new NotFoundException('User not found');

    try {
      const followers = await this.followRepository.findAll({
        where: { followingId: userRecord.id },
        include: { follower: true },
      });

      return {
        success: true,
        message: 'get followers successfully',
        data: followers,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to get followers :: ${(error as Error).message}`,
      );
    }
  }

  async getFollowingByUsername(params: { username: string; filter?: string }) {
    const { username, filter } = params;

    const userRecord = await this.userRepository.findOne({
      where: { displayUsername: username },
    });
    if (!userRecord) throw new NotFoundException('User not found');

    try {
      const following = await this.followRepository.findAll({
        where: {
          followerId: userRecord.id,
          ...(filter
            ? {
                following: {
                  OR: [
                    { name: { contains: filter, mode: 'insensitive' } },
                    { username: { contains: filter, mode: 'insensitive' } },
                    {
                      displayUsername: {
                        contains: filter,
                        mode: 'insensitive',
                      },
                    },
                  ],
                },
              }
            : {}),
        },
        include: {
          following: { include: { followers: true, following: true } },
        },
      });

      return {
        success: true,
        message: 'get following successfully',
        data: following,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to get following :: ${(error as Error).message}`,
      );
    }
  }
}
