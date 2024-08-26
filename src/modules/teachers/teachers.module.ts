import { Module, forwardRef } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { Teacher_Providers } from './teacher.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubjectModel, TeacherModel } from '@core/teacher/infrastructure/sequelize/teacher.model';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [SequelizeModule.forFeature([TeacherModel, SubjectModel]), forwardRef(() => RabbitMQModule)],
  controllers: [TeachersController],
  providers: [
    ...Object.values(Teacher_Providers.REPOSITORIES),
    ...Object.values(Teacher_Providers.USE_CASES)
  ],
  exports: ['TeacherRepository', Teacher_Providers.USE_CASES.Delete_Teacher_Usecase.provide]
})
export class TeachersModule {}
