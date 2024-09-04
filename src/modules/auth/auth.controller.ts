import {
  Controller,
  Post,
  Get, // Add Get decorator
  Body,
  Request,
  UseGuards,
  HttpStatus,
  ConflictException,
  Res,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResponseDto } from 'src/dto/response.dto';
import { Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from '../user/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { username, email, password } = createUserDto;
    this.logger.log(`Registering user with email: ${email}`);

    try {
      const user = await this.userService.createUser(username, email, password);
      const responseData = {
        user: {
          username: user.username,
          email: user.email,
        },
      };
      this.logger.log(`User registered successfully with email: ${email}`);
      return res
        .status(HttpStatus.CREATED)
        .json(
          new ResponseDto(
            responseData,
            'User registered successfully',
            HttpStatus.CREATED,
          ),
        );
    } catch (error) {
      if (error instanceof ConflictException) {
        this.logger.warn(`Registration failed: Email ${email} already in use`);
        return res
          .status(HttpStatus.CONFLICT)
          .json(new ResponseDto(null, error.message, HttpStatus.CONFLICT));
      }
      this.logger.error(`Registration failed for email: ${email}`, error.stack);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email } = loginDto;
    this.logger.log(`Attempting login for email: ${email}`);

    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      const token = await this.authService.login(user);
      const responseData = {
        user: {
          username: user.username,
          email: user.email,
        },
        token: token.access_token,
      };
      this.logger.log(`Login successful for email: ${email}`);
      return new ResponseDto(responseData, 'Login successful', HttpStatus.OK);
    } catch (error) {
      this.logger.error(`Login failed for email: ${email}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verifyToken(@Request() req) {
    this.logger.log(`Verifying token for user ID: ${req.user.id}`);
    return new ResponseDto(
      { username: req.user.username, email: req.user.email },
      'Token is valid',
      HttpStatus.OK,
    );
  }
}
