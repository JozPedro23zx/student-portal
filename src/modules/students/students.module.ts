import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentModel } from '@core/student/infrastructure/sequelize/student.model';
import { Student_Providers } from './students.providers';


@Module({
  imports: [SequelizeModule.forFeature([StudentModel])],
  controllers: [StudentsController],
  providers: [
    ...Object.values(Student_Providers.REPOSITORIES),
    ...Object.values(Student_Providers.USE_CASES)
  ],
  exports: ['StudentRepository']
})
export class StudentsModule {}
