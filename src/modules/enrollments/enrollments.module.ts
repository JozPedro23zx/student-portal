import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { Enrollment_Providers } from './enrollments.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { EnrollmentModel } from '@core/enrollment/infrastructure/sequelize/enrollment.model';

@Module({
  imports: [SequelizeModule.forFeature([EnrollmentModel])],
  controllers: [EnrollmentsController],
  providers: [
    ...Object.values(Enrollment_Providers.REPOSITORIES),
    ...Object.values(Enrollment_Providers.USE_CASES),
  ],
  exports: ['EnrollmentRepository']
})
export class EnrollmentsModule {}
