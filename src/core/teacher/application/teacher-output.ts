import { Teacher } from "../domain/teacher.entity";

export type TeacherOutput = {
    id: string;
    first_name: string;
    last_name: string;
    subject_specialization: string[];
    date_of_birth: Date;
    street: string;
    number: number;
    city: string;
    phone_number: string;
    createdAt: Date;
    updatedAt: Date;
}

export class TeacherOutputMapper {
    static toOutput(entity: Teacher): TeacherOutput{
        const subjects = entity.subject_specialization.map((s)=>{
            return s.type
        })

        return {
            id: entity.entityId.id,
            first_name: entity.first_name,
            last_name: entity.last_name,
            subject_specialization: subjects,
            date_of_birth: entity.date_of_birth,
            street: entity.address.street,
            number: entity.address.number,
            city: entity.address.city,
            phone_number: entity.phone_number,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }
    }
}