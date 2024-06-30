import { Module } from '@nestjs/common';
import { ClassroomsController } from './classrooms.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassRoomModel } from '@core/classroom/infrastructure/sequelize/classroom.model';
import { ClassRoom_Providers } from './classrooms.providers';



@Module({
  imports: [SequelizeModule.forFeature([ClassRoomModel])],
  controllers: [ClassroomsController],
  providers: [
    ...Object.values(ClassRoom_Providers.REPOSITORIES),
    ...Object.values(ClassRoom_Providers.USE_CASES)
  ],
  exports: ['ClassRoomRepository']
})
export class ClassroomsModule {}
