import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpStatus,
  Res,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from 'src/dto/response.dto';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ChatRoomService } from './chat-room.service';
import { ApiTags } from '@nestjs/swagger';
import { InviteUserDto } from './dto/invite-user.dt';

@ApiTags('chatrooms')
@Controller('chatrooms')
export class ChatRoomController {
  private readonly logger = new Logger(ChatRoomController.name);

  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post('create')
  async createChatRoom(
    @Body() createChatRoomDto: CreateChatRoomDto,
    @Res() res: Response,
  ) {
    this.logger.log(`Creating chat room with name: ${createChatRoomDto.name}`);

    const chatRoom =
      await this.chatRoomService.createChatRoom(createChatRoomDto);

    this.logger.log(`Chat room created successfully with ID: ${chatRoom._id}`);

    return res
      .status(HttpStatus.CREATED)
      .json(
        new ResponseDto(
          chatRoom,
          'Chat room created successfully',
          HttpStatus.CREATED,
        ),
      );
  }

  @Get(':id')
  async getChatRoomById(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(`Fetching chat room with ID: ${id}`);

    const chatRoom = await this.chatRoomService.getChatRoomById(id);

    if (!chatRoom) {
      this.logger.warn(`Chat room with ID: ${id} not found`);
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(
          new ResponseDto(null, 'Chat room not found', HttpStatus.NOT_FOUND),
        );
    }

    this.logger.log(`Chat room with ID: ${id} retrieved successfully`);

    return res
      .status(HttpStatus.OK)
      .json(
        new ResponseDto(
          chatRoom,
          'Chat room retrieved successfully',
          HttpStatus.OK,
        ),
      );
  }

  @Get()
  async getAllChatRooms(@Res() res: Response) {
    this.logger.log('Fetching all chat rooms');

    const chatRooms = await this.chatRoomService.getAllChatRooms();

    this.logger.log('All chat rooms retrieved successfully');

    return res
      .status(HttpStatus.OK)
      .json(
        new ResponseDto(
          chatRooms,
          'Chat rooms retrieved successfully',
          HttpStatus.OK,
        ),
      );
  }

  @Delete(':id')
  async deleteChatRoom(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(`Deleting chat room with ID: ${id}`);

    await this.chatRoomService.deleteChatRoom(id);

    this.logger.log(`Chat room with ID: ${id} deleted successfully`);

    return res
      .status(HttpStatus.OK)
      .json(
        new ResponseDto(null, 'Chat room deleted successfully', HttpStatus.OK),
      );
  }

  @Post(':id/invite')
  async inviteUser(
    @Param('id') roomId: string,
    @Body() inviteUserDto: InviteUserDto,
    @Res() res: Response,
  ) {
    this.logger.log(`Inviting user to chat room with ID: ${roomId}`);

    try {
      const updatedChatRoom = await this.chatRoomService.inviteUserToRoom(
        roomId,
        inviteUserDto,
      );

      this.logger.log(
        `User invited successfully to chat room with ID: ${roomId}`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          new ResponseDto(
            updatedChatRoom,
            'User invited successfully',
            HttpStatus.OK,
          ),
        );
    } catch (error) {
      this.logger.error(`Error inviting user: ${error.message}`);
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ResponseDto(null, error.message, HttpStatus.NOT_FOUND));
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new ResponseDto(null, error.message, HttpStatus.BAD_REQUEST));
    }
  }
}
