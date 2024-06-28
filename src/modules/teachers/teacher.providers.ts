import { CreateTeacherUsecase } from "@core/teacher/application/create-teacher/create-teacher.usecase";
import { DeleteTeacherUsecase } from "@core/teacher/application/delete-teacher/delete-teacher.usecase";
import { FindAllTeacherUsecase } from "@core/teacher/application/find-teacher/find-all-teacher.usecase";
import { FindTeacherUsecase } from "@core/teacher/application/find-teacher/find-teacher.usecase";
import { UpdateTeacherUsecase } from "@core/teacher/application/update-teacher/update-teacher.usecase";
import { TeacherRepositoryInMemory } from "@core/teacher/infrastructure/in-memory/teacher-in-memory.repository";
import { TeacherSequelizeRepository } from "@core/teacher/infrastructure/sequelize/teacher-sequelize.repository";
import { SubjectModel, TeacherModel } from "@core/teacher/infrastructure/sequelize/teacher.model";
import { ITeacherRepository } from "@core/teacher/infrastructure/teacher-interface.repository";
import { getModelToken } from "@nestjs/sequelize";

export const REPOSITORIES = {
    Teacher_Repository: {
      provide: 'TeacherRepository',
      useExisting: TeacherSequelizeRepository,
    },
    Teacher_Repository_Memory: {
      provide: TeacherRepositoryInMemory,
      useClass: TeacherRepositoryInMemory,
    },
    Teacher_Repository_Sequelize: {
      provide: TeacherSequelizeRepository,
      useFactory: (teacherModel: typeof TeacherModel) => {
        return new TeacherSequelizeRepository(teacherModel);
      },
      inject: [getModelToken(TeacherModel), getModelToken(SubjectModel)],
    },
  };
  
  export const USE_CASES = {
    Create_Teacher_Usecase: {
      provide: CreateTeacherUsecase,
      useFactory: (teacherRepo: ITeacherRepository) => {
        return new CreateTeacherUsecase(teacherRepo)
      },
      inject: [REPOSITORIES.Teacher_Repository.provide],
    },
    Update_Teacher_Usecase: {
      provide: UpdateTeacherUsecase,
      useFactory: (teacherRepo: ITeacherRepository) => {
        return new UpdateTeacherUsecase(teacherRepo);
      },
      inject: [REPOSITORIES.Teacher_Repository.provide],
    },
    Find_Teacher_Usecase: {
      provide: FindTeacherUsecase,
      useFactory: (teacherRepo: ITeacherRepository) => {
        return new FindTeacherUsecase(teacherRepo);
      },
      inject: [REPOSITORIES.Teacher_Repository.provide],
    },
    FindAll_Teacher_Usecase: {
        provide: FindAllTeacherUsecase,
        useFactory: (teacherRepo: ITeacherRepository) => {
          return new FindAllTeacherUsecase(teacherRepo);
        },
        inject: [REPOSITORIES.Teacher_Repository.provide],
    },
    Delete_Teacher_Usecase: {
      provide: DeleteTeacherUsecase,
      useFactory: (teacherRepo: ITeacherRepository) => {
        return new DeleteTeacherUsecase(teacherRepo);
      },
      inject: [REPOSITORIES.Teacher_Repository.provide],
    },
  };
  
  export const Teacher_Providers = {
    REPOSITORIES,
    USE_CASES,
  };