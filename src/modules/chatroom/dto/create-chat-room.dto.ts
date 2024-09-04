import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateChatRoomDto {
  @ApiProperty({
    example: 'General Chat',
    description: 'The name of the chat room',
  })
  @IsNotEmpty({ message: 'Chat room name is required' })
  name: string;

  @ApiProperty({
    type: [String],
    example: ['user1@example.com', 'user2@example.com'],
    description: 'Array of participant emails',
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Participants are required' })
  @ArrayUnique({ message: 'Participants must be unique' })
  @IsEmail(
    {},
    { each: true, message: 'Each participant must be a valid email' },
  )
  participants: Array<string>;
}
