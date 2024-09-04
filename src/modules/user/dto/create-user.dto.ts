import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'JohnDoe',
    description: 'The unique username of the user.',
    minLength: 3,
    maxLength: 20,
    required: true,
  })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description:
      'The email address of the user. It must be a valid email format.',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    example: 'strongPassword123!',
    description:
      'The password for the user account. Must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
    minLength: 8,
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, {
    message: 'Password is too short. It should be at least 8 characters long.',
  })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'Password is too weak. It should contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;
}
