import { Body, Controller, HttpException, Inject, Post, UseFilters, UseGuards, Request } from '@nestjs/common';
import { Services } from '../utils/constants';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../utils/http-exception.filter';
import { IUserService } from '../users/users.interface';
import { IAuthService } from './auth.interface';
import { CreateUserDto } from '../users/dtos';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags()
@UseFilters(new HttpExceptionFilter())
@Controller()
export class AuthController {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      const { password, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      throw new HttpException(error.sqlMessage, error.code | 400);
    }
  }

  @ApiBody({ type: LoginDto })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return this.authService.login(req.user);
  }
}
