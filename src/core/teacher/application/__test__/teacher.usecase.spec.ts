import { TeacherRepositoryInMemory } from "@core/teacher/infrastructure/in-memory/teacher-in-memory.repository";
import { CreateTeacherUsecase } from "../create-teacher/create-teacher.usecase";
import CreateTeacherInput, { ValidateCreateTeacherInput } from "../create-teacher/input-create-teacher";
import { TeacherFakeBuilder } from "@core/teacher/domain/teacher.fake";
import { Subject } from "@core/teacher/domain/value-object/subject.vo";
import UpdateTeacherInput from "../update-teacher/input-update-teacher";
import { UpdateTeacherUsecase } from "../update-teacher/update-teacher.usecase";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { FindTeacherUsecase } from "../find-teacher/find-teacher.usecase";
import { FindAllTeacherUsecase } from "../find-teacher/find-all-teacher.usecase";
import { DeleteTeacherUsecase } from "../delete-teacher/delete-teacher.usecase";

describe("Teacher unit test", ()=>{
    let repository: TeacherRepositoryInMemory;

    describe("Create teacher usecase", ()=>{
        let createUsecase: CreateTeacherUsecase;

        beforeEach(()=>{
            repository = new TeacherRepositoryInMemory();
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
    
            await createUsecase.execute(input);
    
            const foundTeacher = await repository.findAll();
            expect(foundTeacher.length).toBe(1);
            expect(foundTeacher[0].first_name).toBe('John');
            expect(foundTeacher[0].last_name).toBe('Doe');
        });
    
        it('should throw validation error for invalid input', async () => {
            const input = new CreateTeacherInput({
                first_name: '',
                last_name: '',
                subject_specialization: ['invalid_subject'],
                date_of_birth: new Date('1980-01-01'),
                street: '',
                number: -1,
                city: '',
                phone_number: 'invalid_phone',
            });

            const err = ValidateCreateTeacherInput.validate(input)
    
            expect(err.length).toBeGreaterThan(0);
        });
    })

    describe("Update teacher usecase", ()=>{
        let updateUsecase: UpdateTeacherUsecase;

        beforeEach(()=>{
            repository = new TeacherRepositoryInMemory();
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

        it('should throw not found error if teacher does not exist', async () => {
            const input: UpdateTeacherInput = {
                id: "15b1db7b-6c4f-4d59-b6ae-42189c16a99f",
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
    
            await expect(updateUsecase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    })

    describe("Find teacher usecase", ()=>{
        let findUsecase: FindTeacherUsecase;
        let findAllUsecase: FindAllTeacherUsecase;

        beforeEach(()=>{
            repository = new TeacherRepositoryInMemory();
            findUsecase = new FindTeacherUsecase(repository);
            findAllUsecase = new FindAllTeacherUsecase(repository);
        })

        it("should find a teacher", async ()=>{
            const teacher = TeacherFakeBuilder.aTeacher().build();

            repository.entities = [teacher];

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
            const teacher = TeacherFakeBuilder.aTeacher().build();
            const teacher2 = TeacherFakeBuilder.aTeacher().build();
            const teacher3 = TeacherFakeBuilder.aTeacher().build();
            
            repository.entities = [teacher, teacher2, teacher3];

            let output = await findAllUsecase.execute();

            expect(Array.isArray(output)).toBe(true);
            expect(output.length).toBe(repository.entities.length);
        })

        it("should find some teacher", async ()=>{
            const teacher = TeacherFakeBuilder.aTeacher().build();
            const teacher2 = TeacherFakeBuilder.aTeacher().build();
            const teacher3 = TeacherFakeBuilder.aTeacher().build();
            
            repository.entities = [teacher, teacher2, teacher3];

            let output = await findAllUsecase.execute({ids: [teacher.entityId.id, teacher3.entityId.id]});

            expect(Array.isArray(output)).toBe(true);
            expect(output.length).toBe(2);
        })
    })

    describe("Delete teacher usecase", ()=>{
        let deleteUsecase: DeleteTeacherUsecase;

        beforeEach(()=>{
            repository = new TeacherRepositoryInMemory();
            deleteUsecase = new DeleteTeacherUsecase(repository);
        })

        it("should delete teacher", async ()=>{
            const teacher = TeacherFakeBuilder.aTeacher().build();

            repository.entities = [teacher];

            await deleteUsecase.execute({id: teacher.entityId.id})

            expect(repository.entities.length).toBe(0)
        })
    })
})