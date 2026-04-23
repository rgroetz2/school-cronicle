import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { AppointmentsModule } from '../modules/appointments/appointments.module';
import { ContactsModule } from '../modules/contacts/contacts.module';

@Module({
  imports: [AuthModule, AppointmentsModule, ContactsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
