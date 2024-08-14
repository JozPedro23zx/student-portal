import { CreateGradeUsecase } from "@core/grade/application/create-grade/create-grade";
import { DeleteGradeUsecase } from "@core/grade/application/delete-grade/delete-grade.usecase";
import { FindAllGradesUsecase } from "@core/grade/application/find-grade/find-all-grade.usecase";
import { FindGradeByStudentUsecase } from "@core/grade/application/find-grade/find-grade-by-student";
import { FindGradeUsecase } from "@core/grade/application/find-grade/find-grade.usecase";
import { UpdateGradeUsecase } from "@core/grade/application/update-grade/update-grade.usecase";
import { IGradeRepository } from "@core/grade/infrastructure/grade.repository";
import { GradeSequelizeRepository } from "@core/grade/infrastructure/sequelize/grade-sequelize.repository";
import { GradeModel } from "@core/grade/infrastructure/sequelize/grade.model";
import { getModelToken } from "@nestjs/sequelize";


export const REPOSITORIES = {
    Grade_Repository: {
      provide: 'GradeRepository',
      useExisting: GradeSequelizeRepository,
    },
    Grade_Repository_Sequelize: {
      provide: GradeSequelizeRepository,
      useFactory: (gradeModel: typeof GradeModel) => {
        return new GradeSequelizeRepository(gradeModel);
      },
      inject: [getModelToken(GradeModel)],
    },
  };

  export const USE_CASES = {
    Create_Grade_Usecase: {
      provide: CreateGradeUsecase,
      useFactory: (gradeRepo: IGradeRepository) => {
        return new CreateGradeUsecase(gradeRepo);
      },
      inject: [REPOSITORIES.Grade_Repository.provide],
    },
    Update_Grade_Usecase: {
      provide: UpdateGradeUsecase,
      useFactory: (gradeRepo: IGradeRepository) => {
        return new UpdateGradeUsecase(gradeRepo);
      },
      inject: [REPOSITORIES.Grade_Repository.provide],
    },
    Find_Grade_Usecase: {
      provide: FindGradeUsecase,
      useFactory: (gradeRepo: IGradeRepository) => {
        return new FindGradeUsecase(gradeRepo);
      },
      inject: [REPOSITORIES.Grade_Repository.provide],
    },
    FindAll_Grade_Usecase: {
      provide: FindAllGradesUsecase,
      useFactory: (gradeRepo: IGradeRepository) => {
        return new FindAllGradesUsecase(gradeRepo);
      },
      inject: [REPOSITORIES.Grade_Repository.provide],
    },
    Find_Grade_By_Student_Usecase: {
      provide: FindGradeByStudentUsecase,
      useFactory: (gradeRepo: IGradeRepository) => {
        return new FindGradeByStudentUsecase(gradeRepo);
      },
      inject: [REPOSITORIES.Grade_Repository.provide],
    },
    Delete_Grade_Usecase: {
      provide: DeleteGradeUsecase,
      useFactory: (gradeRepo: IGradeRepository) => {
        return new DeleteGradeUsecase(gradeRepo);
      },
      inject: [REPOSITORIES.Grade_Repository.provide],
    },
  };
  
  export const GradeProviders = {
    REPOSITORIES,
    USE_CASES,
  };