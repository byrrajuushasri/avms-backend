import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // =========================
  // CREATE USER
  // =========================
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      userType: createUserDto.userType,
      status: createUserDto.status,
    });

    const savedUser =
      await this.userRepository.save(user);

    return {
      message: 'User added successfully',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        userType: savedUser.userType,
        status: savedUser.status,
      },
    };
  }

  // =========================
  // GET ALL USERS
  // =========================
  async findAll() {
    return this.userRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  // =========================
  // GET USER BY ID
  // =========================
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return user;
  }

  // =========================
  // UPDATE USER
  // =========================
  async update(
    id: number,
    updateUserDto: CreateUserDto,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    // Check whether another user already
    // has this email
    const existingUser =
      await this.userRepository.findOne({
        where: {
          email: updateUserDto.email,
        },
      });

    if (
      existingUser &&
      existingUser.id !== id
    ) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    // Update fields
    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;
    user.userType = updateUserDto.userType;
    user.status = updateUserDto.status;

    const updatedUser =
      await this.userRepository.save(user);

    return {
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        userType: updatedUser.userType,
        status: updatedUser.status,
      },
    };
  }
}