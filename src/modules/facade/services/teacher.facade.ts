import { DeleteTeacherUsecase } from "@core/teacher/application/delete-teacher/delete-teacher.usecase";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class TeacherFacade {
    @Inject(DeleteTeacherUsecase)
    private deleteTeacherUsecase: DeleteTeacherUsecase;

    async deleteTeacher(id: string) {
        return this.deleteTeacherUsecase.execute({ id });
    }
}
