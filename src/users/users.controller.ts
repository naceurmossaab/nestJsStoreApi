import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, Routes, Services } from '../utils/constants';
import { HttpExceptionFilter } from '../utils/http-exception.filter';
import { IUserService } from './users.interface';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { Roles } from '../auth/guards/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';

@ApiTags(Routes.USERS)
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(new HttpExceptionFilter())
@Controller(Routes.USERS)
export class UsersController {
  constructor(@Inject(Services.USERS) private readonly userService: IUserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      const { password, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      throw new HttpException(error.sqlMessage, error.code | 400);
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new HttpException(`no user with id: ${id}`, HttpStatus.BAD_REQUEST);
    return user;
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.userService.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.sqlMessage, error.code | 400);
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
