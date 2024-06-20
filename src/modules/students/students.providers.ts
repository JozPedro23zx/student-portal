import { CreateStudentUsecase } from "@core/student/application/create-student/create-student.usecase";
import { DeleteStudentUsecase } from "@core/student/application/delete-student/delete-student";
import { FindAllStudentUsecase } from "@core/student/application/find-student/find-all-students.usecase";
import { FindStudentUsecase } from "@core/student/application/find-student/find-student.usecase";
import { UpdateStudentUsecase } from "@core/student/application/update-student/update-student.usecase";
import { StudentRepositoryInMemory } from "@core/student/infrastructure/in-memory/student-in-memory.repository";
import { StudentSequelizeRepository } from "@core/student/infrastructure/sequelize/student-sequelize.repository";
import { StudentModel } from "@core/student/infrastructure/sequelize/student.model";
import { IStudentRepository } from "@core/student/infrastructure/student-interface.repository";
import { getModelToken } from "@nestjs/sequelize";

export const REPOSITORIES = {
    Student_Repository: {
      provide: 'StudentRepository',
      useExisting: StudentSequelizeRepository,
    },
    Student_Repository_Memory: {
      provide: StudentRepositoryInMemory,
      useClass: StudentRepositoryInMemory,
    },
    Student_Repository_Sequelize: {
      provide: StudentSequelizeRepository,
      useFactory: (studentModel: typeof StudentModel) => {
        return new StudentSequelizeRepository(studentModel);
      },
      inject: [getModelToken(StudentModel)],
    },
  };
  
  export const USE_CASES = {
    Create_Student_Usecase: {
      provide: CreateStudentUsecase,
      useFactory: (studentRepo: IStudentRepository) => {
        return new CreateStudentUsecase(studentRepo)
      },
      inject: [REPOSITORIES.Student_Repository.provide],
    },
    Update_Student_Usecase: {
      provide: UpdateStudentUsecase,
      useFactory: (studentRepo: IStudentRepository) => {
        return new UpdateStudentUsecase(studentRepo);
      },
      inject: [REPOSITORIES.Student_Repository.provide],
    },
    Find_Student_Usecase: {
      provide: FindStudentUsecase,
      useFactory: (studentRepo: IStudentRepository) => {
        return new FindStudentUsecase(studentRepo);
      },
      inject: [REPOSITORIES.Student_Repository.provide],
    },
    FindAll_Student_Usecase: {
        provide: FindAllStudentUsecase,
        useFactory: (studentRepo: IStudentRepository) => {
          return new FindAllStudentUsecase(studentRepo);
        },
        inject: [REPOSITORIES.Student_Repository.provide],
    },
    Delete_Student_Usecase: {
      provide: DeleteStudentUsecase,
      useFactory: (studentRepo: IStudentRepository) => {
        return new DeleteStudentUsecase(studentRepo);
      },
      inject: [REPOSITORIES.Student_Repository.provide],
    },
  };
  
  export const Student_Providers = {
    REPOSITORIES,
    USE_CASES,
  };