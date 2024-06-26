import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { TeacherFakeBuilder } from "@core/teacher/domain/teacher.fake";
import { TeacherSequelizeRepository } from "./teacher-sequelize.repository";
import { SubjectModel, TeacherModel } from "./teacher.model";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { Subject, Subjects } from "@core/teacher/domain/value-object/subject.vo";

describe("Teacher sequelize unity test", ()=> {
    let repository: TeacherSequelizeRepository;

    
    setupSequelize({ models: [TeacherModel, SubjectModel] });
    
    beforeEach(async ()=>{
        repository = new TeacherSequelizeRepository(TeacherModel);
    })

    it("should insert teacher on repository", async ()=>{
        const teacher = TeacherFakeBuilder.aTeacher().build()
        await repository.create(teacher);

        const teacherCreated = await repository.find(teacher.entityId);
        expect(teacherCreated!.toJSON()).toStrictEqual(teacher.toJSON());
    })

    it("should find a teacher by id", async ()=>{
        let entityFound = await repository.find(new Uuid());
        expect(entityFound).toBeNull();

        const teacher = TeacherFakeBuilder.aTeacher().build();
        await repository.create(teacher);
        entityFound = await repository.find(teacher.entityId);
        expect(teacher.toJSON()).toStrictEqual(entityFound!.toJSON())
    })

    it("should find all teacher", async ()=>{
        const teacher = TeacherFakeBuilder.aTeacher().build();
        await repository.create(teacher);
        const entities = await repository.findAll();
        expect(entities).toHaveLength(1);
        expect(JSON.stringify(entities)).toBe(JSON.stringify([teacher]));
    })

    it('should find multiple Teachers by IDs', async () => {
        const teacher = TeacherFakeBuilder.aTeacher().build();
        const teacher2 = TeacherFakeBuilder.aTeacher().build();

        await repository.create(teacher);
        await repository.create(teacher2);

        const foundTeachers = await repository.findByIds([teacher.entityId, teacher2.entityId]);
        expect(foundTeachers.length).toBe(2);
        expect(foundTeachers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ entityId: teacher.entityId }),
                expect.objectContaining({ entityId: teacher2.entityId }),
            ])
        );
    });

    it("should throw error on update when a entity not found", async ()=>{
        const teacher = TeacherFakeBuilder.aTeacher().build();
        await expect(repository.update(teacher)).rejects.toThrow(CustomNotFoundError);
    })

    it('should update a Teacher', async () => {
        const teacher = TeacherFakeBuilder.aTeacher().withSubjectSpecialization([Subject.create(Subjects.MATH)]).build();

        await repository.create(teacher);
        console.log(teacher)
        teacher.changeName('Jane', 'Smith');
        teacher.changePhone('987-654-3210');
        teacher.addSubjectSpecialization(Subject.create(Subjects.SCIENCE));
        await repository.update(teacher);

        const foundTeacher = await repository.find(teacher.entityId);

        expect(foundTeacher.first_name).toBe('Jane');
        expect(foundTeacher.last_name).toBe('Smith');
        expect(foundTeacher.phone_number).toBe('987-654-3210');
        expect(foundTeacher.subject_specialization.length).toBe(2);
    });

    it('should delete a Teacher', async () => {
        const teacher = TeacherFakeBuilder.aTeacher().build();

        await repository.create(teacher);
        await repository.delete(teacher.entityId);

        const foundTeacher = await repository.find(teacher.entityId);
        expect(foundTeacher).toBeNull();
    });
})