import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { Teacher_Providers } from './teacher.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubjectModel, TeacherModel } from '@core/teacher/infrastructure/sequelize/teacher.model';

@Module({
  imports: [SequelizeModule.forFeature([TeacherModel, SubjectModel])],
  controllers: [TeachersController],
  providers: [
    ...Object.values(Teacher_Providers.REPOSITORIES),
    ...Object.values(Teacher_Providers.USE_CASES)
  ],
  exports: ['TeacherRepository']
})
export class TeachersModule {}
