import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
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
    description: 'The password for the user account. This field is required.',
    required: true,
  })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
