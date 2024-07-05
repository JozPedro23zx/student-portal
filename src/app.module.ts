import { Module } from '@nestjs/common';
import { MyConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { ClassroomsModule } from './modules/classrooms/classrooms.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { GradesModule } from './modules/grades/grades.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [MyConfigModule.forRoot(), DatabaseModule, StudentsModule, TeachersModule, ClassroomsModule, EnrollmentsModule, GradesModule, AuthModule],
  providers: [],
})
export class AppModule {}
