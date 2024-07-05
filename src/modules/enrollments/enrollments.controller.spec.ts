import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentOutput } from '@core/enrollment/application/enrollment-output';
import { UpdateEnrollmentUsecase } from '@core/enrollment/application/update-enrollment/update-enrollment.usecase';
import { Enrollment } from '@core/enrollment/domain/enrollment';
import { EnrollmentFakeBuilder } from '@core/enrollment/domain/enrollment.fake';
import { IEnrollmentRepository } from '@core/enrollment/infrastructure/enrollment-interface.repository';
import { DatabaseModule } from '../database/database.module';
import { EnrollmentsModule } from './enrollments.module';
import { CreateEnrollmentUseCase } from '@core/enrollment/application/create-enrollment/create-enrollment.usecase';
import { DeleteEnrollmentUseCase } from '@core/enrollment/application/delete-enrollment/delete-enrollment.usecase';
import { FindAllEnrollmentsUseCase } from '@core/enrollment/application/find/find-all-enrollment.usecase';
import { FindEnrollmentUseCase } from '@core/enrollment/application/find/find-enrollment.usecase';
import { MyConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';

describe('Enrollments Controller integration tests', () => {
  let controller: EnrollmentsController;
  let repository: IEnrollmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MyConfigModule.forRoot(),
        DatabaseModule,
        EnrollmentsModule,
        AuthModule
      ],
    }).compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
    repository = module.get<IEnrollmentRepository>('EnrollmentRepository');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUsecase']).toBeInstanceOf(CreateEnrollmentUseCase);
    expect(controller['updateUsecase']).toBeInstanceOf(UpdateEnrollmentUsecase);
    expect(controller['findUsecase']).toBeInstanceOf(FindEnrollmentUseCase);
    expect(controller['findAllUsecase']).toBeInstanceOf(FindAllEnrollmentsUseCase);
    expect(controller['deleteUsecase']).toBeInstanceOf(DeleteEnrollmentUseCase);
  });

  it('should call controller to create an enrollment', async () => {
    const input = {
      student_id: "student-uuid",
      class_id: "class-uuid",
      enrollment_date: new Date("2023-07-01"),
      status: "enrolled",
    };

    const expectedOutput: EnrollmentOutput = {
      id: expect.any(String),
      student_id: "student-uuid",
      class_id: "class-uuid",
      enrollment_date: input.enrollment_date,
      status: "enrolled",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    };

    const output = await controller.create(input);

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to find one enrollment', async () => {
    const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
    await repository.create(enrollment);

    const expectedOutput: EnrollmentOutput = {
      id: enrollment.entityId.id,
      student_id: enrollment.student_id,
      class_id: enrollment.class_id,
      enrollment_date: enrollment.enrollment_date,
      status: enrollment.status.type,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    };

    const output = await controller.findOne(enrollment.entityId.id);

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to find all enrollments', async () => {
    const enrollments = EnrollmentFakeBuilder.theEnrollments(3).build() as Enrollment[];

    for (const enrollment of enrollments) {
      await repository.create(enrollment);
    }

    const expectedOutput: EnrollmentOutput[] = enrollments.map(enrollment => ({
      id: enrollment.entityId.id,
      student_id: enrollment.student_id,
      class_id: enrollment.class_id,
      enrollment_date: enrollment.enrollment_date,
      status: enrollment.status.type,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    }));

    const output = await controller.findAll();
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to find some enrollments', async () => {
    const enrollments = EnrollmentFakeBuilder.theEnrollments(3).build() as Enrollment[];

    for (const enrollment of enrollments) {
      await repository.create(enrollment);
    }

    const enrollmentIds = [enrollments[0].entityId.id, enrollments[2].entityId.id];

    const expectedOutput: EnrollmentOutput[] = [enrollments[0], enrollments[2]].map(enrollment => ({
      id: enrollment.entityId.id,
      student_id: enrollment.student_id,
      class_id: enrollment.class_id,
      enrollment_date: enrollment.enrollment_date,
      status: enrollment.status.type,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    }));

    let output = await controller.findAll(enrollmentIds);

    output = enrollmentIds.map(id => output.find(enrollment => enrollment.id === id));

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to update enrollment', async () => {
    const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
    await repository.create(enrollment);

    const updateEnrollmentInput = {
      id: enrollment.entityId.id,
      status: 'completed'
    };

    const expectedOutput: EnrollmentOutput = {
      id: enrollment.entityId.id,
      student_id: enrollment.student_id,
      class_id: enrollment.class_id,
      enrollment_date: enrollment.enrollment_date,
      status: updateEnrollmentInput.status,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    };

    const output = await controller.update(updateEnrollmentInput);

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to delete enrollment', async () => {
    const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
    await repository.create(enrollment);

    await controller.remove(enrollment.entityId.id);

    let output = await repository.find(enrollment.entityId);

    expect(output).toBeNull();
  });
});
