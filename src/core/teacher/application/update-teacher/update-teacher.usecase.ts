import UpdateTeacherInput from "./input-update-teacher";
import { Subject } from "@core/teacher/domain/value-object/subject.vo";
import { Address } from "@core/teacher/domain/value-object/address.vo";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { EntityValidationError } from "@core/@shared/erros/validate.error";
import { TeacherOutput, TeacherOutputMapper } from "../teacher-output";
import { IUseCase } from "@core/@shared/application/use-case-interface";
import { ITeacherRepository } from "@core/teacher/infrastructure/teacher-interface.repository";


export class UpdateTeacherUsecase implements IUseCase<UpdateTeacherInput, TeacherOutput>{
    constructor(private teacherRepository: ITeacherRepository) {}

    async execute(input: UpdateTeacherInput): Promise<TeacherOutput> {

        const teacher = await this.teacherRepository.find(new Uuid(input.id));

        if (!teacher) {
            throw new CustomNotFoundError(input.id, 'Teacher');
        }

        teacher.changeName(input.first_name, input.last_name);
        input.date_of_birth && teacher.changeBirthday(input.date_of_birth);
        input.phone_number && teacher.changePhone(input.phone_number);
        input.subject_to_add && teacher.addSubjectSpecialization(Subject.create(input.subject_to_add))
        input.subject_to_remove && teacher.removeSubjectSpecialization(Subject.create(input.subject_to_remove))
        if (input.address) {
            const address2 = new Address({
                street: input.address.street,
                number: input.address.number,
                city: input.address.city,
            });
            teacher.changeAddress(new Address(address2));
        }
        if(input.subject_specialization){
            input.subject_specialization.map(s =>{
                teacher.addSubjectSpecialization(Subject.create(s));
            })
        }

        if(teacher.notifications.hasErrors()){
            throw new EntityValidationError(teacher.notifications.messages())
        }
        

        await this.teacherRepository.update(teacher);

        return TeacherOutputMapper.toOutput(teacher)
    }
}
