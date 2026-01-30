import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangeEmailDto } from './dto/change-email.dto';

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('invalid-id')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id', mockUser.id);
      expect(result).toHaveProperty('email', mockUser.email);
      expect(result).toHaveProperty('firstName', mockUser.firstName);
      expect(result).toHaveProperty('lastName', mockUser.lastName);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update first name only', async () => {
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'Jane',
      };

      const updatedUser = { ...mockUser, firstName: 'Jane' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(mockUser.id, updateProfileDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('firstName', 'Jane');
      expect(result).toHaveProperty('lastName', mockUser.lastName);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should update last name only', async () => {
      const updateProfileDto: UpdateProfileDto = {
        lastName: 'Smith',
      };

      const updatedUser = { ...mockUser, lastName: 'Smith' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(mockUser.id, updateProfileDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('firstName', mockUser.firstName);
      expect(result).toHaveProperty('lastName', 'Smith');
    });

    it('should update both first name and last name', async () => {
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const updatedUser = { ...mockUser, firstName: 'Jane', lastName: 'Smith' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(mockUser.id, updateProfileDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('firstName', 'Jane');
      expect(result).toHaveProperty('lastName', 'Smith');
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'Jane',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateProfile('invalid-id', updateProfileDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeEmail', () => {
    it('should change email successfully', async () => {
      const changeEmailDto: ChangeEmailDto = {
        email: 'newemail@example.com',
      };

      const updatedUser = { ...mockUser, email: 'newemail@example.com' };
      mockUserRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.changeEmail(mockUser.id, changeEmailDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email', 'newemail@example.com');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if new email already exists', async () => {
      const changeEmailDto: ChangeEmailDto = {
        email: 'existing@example.com',
      };

      const existingUser = { ...mockUser, id: 'different-id' };

      // First call returns the user being updated
      // Second call returns an existing user with different id
      mockUserRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(existingUser);

      await expect(
        service.changeEmail(mockUser.id, changeEmailDto),
      ).rejects.toThrow(ConflictException);

      // Reset mocks for the second assertion
      jest.clearAllMocks();
      mockUserRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(existingUser);

      await expect(
        service.changeEmail(mockUser.id, changeEmailDto),
      ).rejects.toThrow('Email address already exists');
    });

    it('should allow user to keep their own email', async () => {
      const changeEmailDto: ChangeEmailDto = {
        email: mockUser.email,
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.changeEmail(mockUser.id, changeEmailDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email', mockUser.email);
    });

    it('should throw NotFoundException if user not found', async () => {
      const changeEmailDto: ChangeEmailDto = {
        email: 'newemail@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.changeEmail('invalid-id', changeEmailDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
