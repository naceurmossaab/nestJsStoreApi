import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersEntity } from "./users.entity";

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<UsersEntity>;
  findAll(): Promise<UsersEntity[]>;
  findOne(id: number): Promise<UsersEntity | null>;
  findbyLogin(login: string): Promise<UsersEntity | null>;
  findbyEmail(email: string): Promise<UsersEntity | null>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<any>;
  remove(id: number): Promise<any>;
}
