import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Address } from "@core/teacher/domain/value-object/address.vo";
import { Teacher } from "@core/teacher/domain/teacher.entity";
import { SubjectModel, TeacherModel } from "./teacher.model";
import { Subject } from "@core/teacher/domain/value-object/subject.vo";

export class TeacherMapperModel{
    static toModel(entity: Teacher): TeacherModel{
        
        const subjectModels = entity.subject_specialization.map(subject => {
                return SubjectModel.build({
                    id: new Uuid().id,
                    type: subject.type,
                    teacherId: entity.entityId.id
                })
            } 
        );

        return TeacherModel.build({
            id: entity.entityId.id,
            first_name: entity.first_name,
            last_name: entity.last_name,
            date_of_birth: entity.date_of_birth,
            street: entity.address.street,
            number: entity.address.number,
            city: entity.address.city,
            phone_number: entity.phone_number,
            subject_specialization: subjectModels,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }, {
            include: [{model: SubjectModel, as: "subject_specialization"}]
        });
    }

    static toEntity(model: TeacherModel): Teacher{
        const teacherAddress = new Address({
            street: model.street,
            number: model.number,
            city: model.city
        });

        let subjects: Subject[] = [];

        model.subject_specialization.map((s)=>{
            const subject = Subject.create(s.type);
            subjects.push(subject);
        })
        
        const teacher = new Teacher({
            id: new Uuid(model.id),
            first_name: model.first_name,
            last_name: model.last_name,
            subject_specialization: subjects,
            date_of_birth: model.date_of_birth,
            address: teacherAddress,
            phone_number: model.phone_number,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        });

        teacher.validate();

        return teacher
    }
}