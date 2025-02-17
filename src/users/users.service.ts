import { Injectable } from '@nestjs/common';
import { IUserService } from './users.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>) { }

  create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<UsersEntity[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<UsersEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findbyLogin(login: string): Promise<UsersEntity | null> {
    return this.userRepository.findOne({ where: { login } });
  }

  findbyEmail(email: string): Promise<UsersEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }
}
