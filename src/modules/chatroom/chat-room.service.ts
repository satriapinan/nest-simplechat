import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoom } from '../../schemas/chatroom.schema';
import { UserService } from '../user/user.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { InviteUserDto } from './dto/invite-user.dt';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    private userService: UserService,
  ) {}

  async createChatRoom(
    createChatRoomDto: CreateChatRoomDto,
  ): Promise<ChatRoom> {
    const { name, participants } = createChatRoomDto;

    const participantDocs = await Promise.all(
      participants.map(async (email) => {
        const user = await this.userService.findByEmail(email);
        if (!user) {
          throw new BadRequestException(`User with email ${email} not found`);
        }
        return {
          userId: user._id,
          joinedAt: new Date(),
        };
      }),
    );

    const newChatRoom = new this.chatRoomModel({
      name,
      participants: participantDocs,
    });

    return newChatRoom.save();
  }

  async getChatRoomById(id: string): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomModel
      .findById(id)
      .populate('participants.userId');
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }
    return chatRoom;
  }

  async getAllChatRooms(): Promise<ChatRoom[]> {
    return this.chatRoomModel.find().populate('participants.userId').exec();
  }

  async deleteChatRoom(id: string): Promise<void> {
    const result = await this.chatRoomModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Chat room not found');
    }
  }

  async inviteUserToRoom(roomId: string, inviteUserDto: InviteUserDto) {
    const chatRoom = await this.chatRoomModel.findById(roomId);

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    const user = await this.userService.findByEmail(inviteUserDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAlreadyParticipant = chatRoom.participants.some(
      (participant) => participant.userId.toString() === user._id.toString(),
    );

    if (isAlreadyParticipant) {
      throw new Error('User is already a participant');
    }

    const userId =
      typeof user._id === 'string' ? new Types.ObjectId(user._id) : user._id;

    chatRoom.participants.push({
      userId: userId as Types.ObjectId,
      joinedAt: new Date(),
    });

    await chatRoom.save();

    return chatRoom;
  }
}
