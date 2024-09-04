import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ChatRoomModule } from './modules/chatroom/chat-room.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/simplechat'),
    AuthModule,
    UserModule,
    ChatRoomModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
