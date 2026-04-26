import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SchoolPersonalController } from './school-personal.controller';
import { SchoolPersonalService } from './school-personal.service';

@Module({
  imports: [AuthModule],
  controllers: [SchoolPersonalController],
  providers: [SchoolPersonalService],
})
export class SchoolPersonalModule {}
