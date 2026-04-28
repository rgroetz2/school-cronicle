import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { AppointmentsModule } from '../modules/appointments/appointments.module';
import { ContactsModule } from '../modules/contacts/contacts.module';
import { SchoolPersonalModule } from '../modules/school-personal/school-personal.module';
import { SchoolModule } from '../modules/school/school.module';

@Module({
  imports: [AuthModule, AppointmentsModule, ContactsModule, SchoolPersonalModule, SchoolModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
