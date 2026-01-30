import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangeEmailDto } from './dto/change-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.findById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...profile } = user;
    return profile;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Partial<User>> {
    const user = await this.findById(userId);

    if (updateProfileDto.firstName !== undefined) {
      user.firstName = updateProfileDto.firstName;
    }

    if (updateProfileDto.lastName !== undefined) {
      user.lastName = updateProfileDto.lastName;
    }

    const updatedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...profile } = updatedUser;
    return profile;
  }

  async changeEmail(
    userId: string,
    changeEmailDto: ChangeEmailDto,
  ): Promise<Partial<User>> {
    const user = await this.findById(userId);

    // Check if new email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: changeEmailDto.email },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Email address already exists');
    }

    user.email = changeEmailDto.email;
    const updatedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...profile } = updatedUser;
    return profile;
  }
}
