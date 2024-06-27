import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { TeacherSequelizeRepository } from "@core/teacher/infrastructure/sequelize/teacher-sequelize.repository";
import { SubjectModel, TeacherModel } from "@core/teacher/infrastructure/sequelize/teacher.model";
import CreateTeacherInput from "../create-teacher/input-create-teacher";
import { CreateTeacherUsecase } from "../create-teacher/create-teacher.usecase";
import { UpdateTeacherUsecase } from "../update-teacher/update-teacher.usecase";
import { TeacherFakeBuilder } from "@core/teacher/domain/teacher.fake";
import UpdateTeacherInput from "../update-teacher/input-update-teacher";
import { Subject } from "@core/teacher/domain/value-object/subject.vo";
import { FindTeacherUsecase } from "../find-teacher/find-teacher.usecase";
import { FindAllTeacherUsecase } from "../find-teacher/find-all-teacher.usecase";

describe("Teacher integration tests", ()=>{
    let repository: TeacherSequelizeRepository;

    setupSequelize({ models: [TeacherModel, SubjectModel] });

    describe("Create teacher usecase", ()=>{
        let createUsecase: CreateTeacherUsecase;

        beforeEach(()=>{
            repository = new TeacherSequelizeRepository(TeacherModel);
            createUsecase = new CreateTeacherUsecase(repository)
        })

        it('should create a Teacher', async () => {
            const input = new CreateTeacherInput({
                first_name: 'John',
                last_name: 'Doe',
                subject_specialization: ['math', 'science'],
                date_of_birth: new Date('1980-01-01'),
                street: '123 Main St',
                number: 100,
                city: 'New York',
                phone_number: '123-456-7890',
            });
    
            let output = await createUsecase.execute(input);
    
            expect(output.first_name).toBe('John');
            expect(output.last_name).toBe('Doe');
            expect(output.subject_specialization).toEqual(['math', 'science']);
            expect(output.date_of_birth).toEqual(new Date('1980-01-01'));
            expect(output.street).toBe('123 Main St');
            expect(output.number).toBe(100);
            expect(output.city).toBe('New York');
            expect(output.phone_number).toBe('123-456-7890');
        });
    })

    describe("Update teacher usecase", ()=>{
        let updateUsecase: UpdateTeacherUsecase;

        beforeEach(()=>{
            repository = new TeacherSequelizeRepository(TeacherModel);
            updateUsecase = new UpdateTeacherUsecase(repository)
        })

        it("it should update teacher", async ()=>{
            const teacher = TeacherFakeBuilder.aTeacher().withSubjectSpecialization([Subject.create("math")]).build()

            repository.create(teacher)

            const input: UpdateTeacherInput = {
                id: teacher.entityId.id,
                first_name: 'Jane',
                last_name: 'Smith',
                subject_specialization: ['math', 'science'],
                date_of_birth: new Date('1980-01-01'),
                address:{
                    street: '456 Secondary St',
                    number: 200,
                    city: 'Los Angeles',
                },
                phone_number: '987-654-3210',
            }

            await updateUsecase.execute(input);

            let teacherUpdated = await repository.find(teacher.entityId)

            expect(teacherUpdated.first_name).toBe('Jane');
            expect(teacherUpdated.last_name).toBe('Smith');
            expect(teacherUpdated.address.street).toBe('456 Secondary St');
            expect(teacherUpdated.address.number).toBe(200);
            expect(teacherUpdated.address.city).toBe('Los Angeles');
            expect(teacherUpdated.phone_number).toBe('987-654-3210');
            expect(teacherUpdated.subject_specialization.length).toBe(2);


            const input2: UpdateTeacherInput = {
                id: teacher.entityId.id,
                subject_to_add: "history"
            }

            await updateUsecase.execute(input2);
            teacherUpdated = await repository.find(teacher.entityId)
            expect(teacherUpdated.subject_specialization.length).toBe(3);


            const input3: UpdateTeacherInput = {
                id: teacher.entityId.id,
                subject_to_remove: "math"
            }

            await updateUsecase.execute(input3);
            teacherUpdated = await repository.find(teacher.entityId)
            expect(teacherUpdated.subject_specialization.length).toBe(2);
        })
    })

    describe("Find teacher usecase", ()=>{
        let findUsecase: FindTeacherUsecase;
        let findAllUsecase: FindAllTeacherUsecase;

        beforeEach(()=>{
            repository = new TeacherSequelizeRepository(TeacherModel);
            findUsecase = new FindTeacherUsecase(repository);
            findAllUsecase = new FindAllTeacherUsecase(repository);
        })

        it("should find a teacher int", async ()=>{
            const teacher = TeacherFakeBuilder.aTeacher().withSubjectSpecialization([Subject.create("math")]).build();

            repository.create(teacher)

            let output = await findUsecase.execute({id: teacher.entityId.id})

            expect(output.first_name).toBe(teacher.first_name);
            expect(output.last_name).toBe(teacher.last_name);
            expect(output.subject_specialization.length).toBe(teacher.subject_specialization.length);
            expect(output.street).toBe(teacher.address.street);
            expect(output.number).toBe(teacher.address.number);
            expect(output.city).toBe(teacher.address.city);
            expect(output.phone_number).toBe(teacher.phone_number);
        })

        it("should find all teachers", async ()=>{
            const teachers = TeacherFakeBuilder.theTeachers(4).build()
            
            for(const teacher of teachers){
                repository.create(teacher);
            }

            let output = await findAllUsecase.execute();

            expect(Array.isArray(output)).toBe(true);
            expect(output.length).toBe(repository.entities.length);
        })

        it("should find some teacher", async ()=>{
            const teachers = TeacherFakeBuilder.theTeachers(4).build()
            
            for(const teacher of teachers){
                repository.create(teacher);
            }

            let output = await findAllUsecase.execute({ids: [teachers[0].entityId.id, teachers[2].entityId.id]});

            expect(Array.isArray(output)).toBe(true);
            expect(output.length).toBe(2);
        })
    })

})