import { DeleteTeacherUsecase } from '@core/teacher/application/delete-teacher/delete-teacher.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TeacherFacade } from 'src/modules/facade/services/teacher.facade';


@Injectable()
export class ConsumerService {
    @Inject(TeacherFacade)
    private teacherFacade: TeacherFacade;

    @EventPattern('user_creation_failure')
    handleUserCreationFailure(data: any) {
        const { customId } = data;
        this.teacherFacade.deleteTeacher(customId)
    }
}
