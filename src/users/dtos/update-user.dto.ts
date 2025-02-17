import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  login: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  password: string;

  @ApiPropertyOptional()
  role: string;
}