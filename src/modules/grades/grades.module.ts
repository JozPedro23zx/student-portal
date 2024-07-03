import { Module } from '@nestjs/common';
import { GradesController } from './grades.controller';
import { GradeProviders } from './grades.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { GradeModel } from '@core/grade/infrastructure/sequelize/grade.model';

@Module({
  imports: [SequelizeModule.forFeature([GradeModel])],
  controllers: [GradesController],
  providers: [
    ...Object.values(GradeProviders.REPOSITORIES),
    ...Object.values(GradeProviders.USE_CASES),
  ],
  exports: ['GradeRepository']
})
export class GradesModule {}
