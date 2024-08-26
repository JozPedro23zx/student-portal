import { DeleteTeacherUsecase } from "@core/teacher/application/delete-teacher/delete-teacher.usecase";
import { TeacherSequelizeRepository } from "@core/teacher/infrastructure/sequelize/teacher-sequelize.repository";
import { SubjectModel, TeacherModel } from "@core/teacher/infrastructure/sequelize/teacher.model";
import { ITeacherRepository } from "@core/teacher/infrastructure/teacher-interface.repository";
import { getModelToken } from "@nestjs/sequelize";

export const TEACHER_USECASE = {
    Delete_Teacher_Usecase: {
        provide: DeleteTeacherUsecase,
        useFactory: (teacherRepo: ITeacherRepository) => {
            return new DeleteTeacherUsecase(teacherRepo);
        },
        inject: ['TeacherRepository'],
    },
}