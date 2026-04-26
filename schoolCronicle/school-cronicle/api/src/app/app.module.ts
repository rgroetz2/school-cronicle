import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { AppointmentsModule } from '../modules/appointments/appointments.module';
import { ContactsModule } from '../modules/contacts/contacts.module';
import { SchoolPersonalModule } from '../modules/school-personal/school-personal.module';

@Module({
  imports: [AuthModule, AppointmentsModule, ContactsModule, SchoolPersonalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
