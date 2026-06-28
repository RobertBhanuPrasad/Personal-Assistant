import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GmailModule } from './modules/gmail/gmail.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { DriveModule } from './modules/drive/drive.module';
import { DocsModule } from './modules/docs/docs.module';
import { SheetModule } from './modules/sheet/sheet.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { MeetModule } from './modules/meet/meet.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { MemoryModule } from './modules/memory/memory.module';

@Module({
  imports: [GmailModule, CalendarModule, DriveModule, DocsModule, SheetModule, ContactsModule, TasksModule, MeetModule, AiModule, AuthModule, MemoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
