import { UsersEntity } from "../users/users.entity";

export interface IAuthService {
  validate(email: string, password: string): Promise<UsersEntity>;
  login(user: any): any;
}
