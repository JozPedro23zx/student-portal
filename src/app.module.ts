import { Module } from '@nestjs/common';
import { MyConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';

@Module({
  imports: [MyConfigModule.forRoot(), DatabaseModule, StudentsModule, TeachersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
