import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { UsersEntity } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Services } from '../utils/constants';
import { IUserService } from '../users/users.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) { }

  async validate(email: string, password: string): Promise<UsersEntity> {
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.findByLogin(email);
      if (!user) throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);

    return user;
  }

  login(user: any) {
    const { id, email, role } = user;
    const payload = { id, email, role };

    return {
      ...payload,
      access_token: this.jwtService.sign(payload),
    }
  }
}
