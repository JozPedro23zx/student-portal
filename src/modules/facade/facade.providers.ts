import { DeleteTeacherUsecase } from "@core/teacher/application/delete-teacher/delete-teacher.usecase";
import { TeacherSequelizeRepository } from "@core/teacher/infrastructure/sequelize/teacher-sequelize.repository";
import { SubjectModel, TeacherModel } from "@core/teacher/infrastructure/sequelize/teacher.model";
import { ITeacherRepository } from "@core/teacher/infrastructure/teacher-interface.repository";
import { getModelToken } from "@nestjs/sequelize";

export const TEACHER_REPOSITORY_FACADE = {
    Teacher_Repository_Sequelize: {
        provide: TeacherSequelizeRepository,
        useFactory: (teacherModel: typeof TeacherModel) => {
          return new TeacherSequelizeRepository(teacherModel);
        },
        inject: [getModelToken(TeacherModel), getModelToken(SubjectModel)],
    },
}

export const TEACHER_USECASE_FACADE = {
    Delete_Teacher_Usecase: {
        provide: DeleteTeacherUsecase,
        useFactory: (teacherRepo: ITeacherRepository) => {
            return new DeleteTeacherUsecase(teacherRepo);
        },
        inject: [TEACHER_REPOSITORY_FACADE.Teacher_Repository_Sequelize.provide],
    },
}

// export const TeacherFacade = {
//     TEACHER_REPOSITORY_FACADE,
//     TEACHER_USECASE_FACADE
// }