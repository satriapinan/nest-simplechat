import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() body): Promise<any> {
    const { username, email, password } = body;
    return this.userService.createUser(username, email, password);
  }
}
