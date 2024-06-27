import { IUseCase } from "@core/@shared/application/use-case-interface";
import CreateStudentInput from "./input-create-teacher";
import { Subject } from "../../domain/value-object/subject.vo";
import { Teacher } from "../../domain/teacher.entity";
import { Address } from "../../domain/value-object/address.vo";
import { TeacherOutput, TeacherOutputMapper } from "../teacher-output";
import { EntityValidationError } from "@core/@shared/erros/validate.error";
import { ITeacherRepository } from "@core/teacher/infrastructure/teacher-interface.repository";

export class CreateTeacherUsecase implements IUseCase<CreateStudentInput, TeacherOutput>{

    constructor(private teacherRepository: ITeacherRepository) {}

    async execute(input: CreateStudentInput): Promise<TeacherOutput> {
        
        const subjects = input.subject_specialization.map(s =>{
            return Subject.create(s);
        })

        const inputAddress =  new Address({
            street: input.street,
            number: input.number,
            city: input.city
        });

        const teacher = new Teacher({
            first_name: input.first_name,
            last_name: input.last_name,
            subject_specialization: subjects,
            date_of_birth: new Date(input.date_of_birth),
            address: inputAddress,
            phone_number: input.phone_number || null,
        })
        
        teacher.validate();

        if(teacher.notifications.hasErrors()){
            throw new EntityValidationError(teacher.notifications.messages())
        }

        await this.teacherRepository.create(teacher);

        return TeacherOutputMapper.toOutput(teacher)
    }
}