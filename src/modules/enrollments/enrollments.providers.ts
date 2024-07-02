import { CreateEnrollmentUseCase } from "@core/enrollment/application/create-enrollment/create-enrollment.usecase";
import { DeleteEnrollmentUseCase } from "@core/enrollment/application/delete-enrollment/delete-enrollment.usecase";
import { FindEnrollmentsByClassRoomUsecase } from "@core/enrollment/application/find/find-all-by-class.usecase";
import { FindAllEnrollmentsUseCase } from "@core/enrollment/application/find/find-all-enrollment.usecase";
import { FindEnrollmentByStudentUsecase } from "@core/enrollment/application/find/find-by-student.usecase";
import { FindEnrollmentUseCase } from "@core/enrollment/application/find/find-enrollment.usecase";
import { UpdateEnrollmentUsecase } from "@core/enrollment/application/update-enrollment/update-enrollment.usecase";
import { IEnrollmentRepository } from "@core/enrollment/infrastructure/enrollment-interface.repository";
import { EnrollmentSequelizeRepository } from "@core/enrollment/infrastructure/sequelize/enrollment-sequelize.repository";
import { EnrollmentModel } from "@core/enrollment/infrastructure/sequelize/enrollment.model";
import { getModelToken } from "@nestjs/sequelize";

export const REPOSITORIES = {
  Enrollment_Repository: {
    provide: 'EnrollmentRepository',
    useExisting: EnrollmentSequelizeRepository,
  },
  Enrollment_Repository_Sequelize: {
    provide: EnrollmentSequelizeRepository,
    useFactory: (enrollmentModel: typeof EnrollmentModel) => {
      return new EnrollmentSequelizeRepository(enrollmentModel);
    },
    inject: [getModelToken(EnrollmentModel)],
  },
};

export const USE_CASES = {
  Create_Enrollment_Usecase: {
    provide: CreateEnrollmentUseCase,
    useFactory: (enrollmentRepo: IEnrollmentRepository) => {
      return new CreateEnrollmentUseCase(enrollmentRepo);
    },
    inject: [REPOSITORIES.Enrollment_Repository.provide],
  },
  Update_Enrollment_Usecase: {
    provide: UpdateEnrollmentUsecase,
    useFactory: (enrollmentRepo: IEnrollmentRepository) => {
      return new UpdateEnrollmentUsecase(enrollmentRepo);
    },
    inject: [REPOSITORIES.Enrollment_Repository.provide],
  },
  Find_Enrollment_Usecase: {
    provide: FindEnrollmentUseCase,
    useFactory: (enrollmentRepo: IEnrollmentRepository) => {
      return new FindEnrollmentUseCase(enrollmentRepo);
    },
    inject: [REPOSITORIES.Enrollment_Repository.provide],
  },
  FindAll_Enrollments_Usecase: {
    provide: FindAllEnrollmentsUseCase,
    useFactory: (enrollmentRepo: IEnrollmentRepository) => {
      return new FindAllEnrollmentsUseCase(enrollmentRepo);
    },
    inject: [REPOSITORIES.Enrollment_Repository.provide],
  },
  Delete_Enrollment_Usecase: {
    provide: DeleteEnrollmentUseCase,
    useFactory: (enrollmentRepo: IEnrollmentRepository) => {
      return new DeleteEnrollmentUseCase(enrollmentRepo);
    },
    inject: [REPOSITORIES.Enrollment_Repository.provide],
  },
  Find_Enrollment_By_Student_Usecase: {
    provide: FindEnrollmentByStudentUsecase,
    useFactory: (enrollmentRepo: IEnrollmentRepository) => {
      return new FindEnrollmentByStudentUsecase(enrollmentRepo);
    },
    inject: [REPOSITORIES.Enrollment_Repository.provide],
  },
  Find_Enrollments_By_ClassRoom_Usecase: {
    provide: FindEnrollmentsByClassRoomUsecase,
    useFactory: (enrollmentRepo: IEnrollmentRepository) => {
      return new FindEnrollmentsByClassRoomUsecase(enrollmentRepo);
    },
    inject: [REPOSITORIES.Enrollment_Repository.provide],
  },
};

export const Enrollment_Providers = {
  REPOSITORIES,
  USE_CASES,
};
