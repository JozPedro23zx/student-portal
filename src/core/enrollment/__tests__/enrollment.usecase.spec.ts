import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { EnrollmentSequelizeRepository } from "../infrastructure/sequelize/enrollment-sequelize.repository";
import { EnrollmentModel } from "../infrastructure/sequelize/enrollment.model";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CreateEnrollmentUseCase } from "../application/create-enrollment/create-enrollment.usecase";
import CreateEnrollmentInput from "../application/create-enrollment/input-create-enrollment.usecas";
import { EnrollmentOutput, EnrollmentOutputMapper } from "../application/enrollment-output";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { DeleteEnrollmentUseCase } from "../application/delete-enrollment/delete-enrollment.usecase";
import { EnrollmentFakeBuilder } from "../domain/enrollment.fake";
import { FindEnrollmentUseCase } from "../application/find/find-enrollment.usecase";
import { FindAllEnrollmentsUseCase } from "../application/find/find-all-enrollment.usecase";
import { UpdateEnrollmentInput, UpdateEnrollmentUsecase } from "../application/update-enrollment/update-enrollment.usecase";
import { FindEnrollmentByStudentUsecase } from "../application/find/find-by-student.usecase";
import { FindEnrollmentsByClassRoomUsecase } from "../application/find/find-all-by-class.usecase";

describe("Enrollment usecase integration tests", () => {
    let repository: EnrollmentSequelizeRepository;

    setupSequelize({ models: [EnrollmentModel] });

    beforeEach(() => {
        repository = new EnrollmentSequelizeRepository(EnrollmentModel);
    });

    describe("CreateEnrollmentUseCase integration tests", () => {
        let createUseCase: CreateEnrollmentUseCase;

        setupSequelize({ models: [EnrollmentModel] });

        beforeEach(() => {
            repository = new EnrollmentSequelizeRepository(EnrollmentModel);
            createUseCase = new CreateEnrollmentUseCase(repository);
        });

        it('should create a new enrollment', async () => {
            const input = new CreateEnrollmentInput({
                student_id: 'student-id-1',
                class_id: 'class-id-1',
                enrollment_date: new Date(),
                status: 'enrolled'
            });

            const output = await createUseCase.execute(input);

            const enrollmentCreated = await repository.find(new Uuid(output.id));
            const expectedOutput = EnrollmentOutputMapper.toOutput(enrollmentCreated);

            expect(expectedOutput).toStrictEqual({
                id: output.id,
                student_id: output.student_id,
                class_id: output.class_id,
                enrollment_date: output.enrollment_date,
                status: output.status,
                created_at: output.created_at,
                updated_at: output.updated_at
            });
        });
    });

    describe("UpdateEnrollmentUsecase integration tests", () => {
        let useCase: UpdateEnrollmentUsecase;
    
        setupSequelize({ models: [EnrollmentModel] });
    
        beforeEach(() => {
            repository = new EnrollmentSequelizeRepository(EnrollmentModel);
            useCase = new UpdateEnrollmentUsecase(repository);
        });
    
        it('should update the status of an existing enrollment', async () => {
            const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
            await repository.create(enrollment);
    
            const input: UpdateEnrollmentInput = {
                id: enrollment.entityId.id,
                status: 'completed'
            };
    
            const output = await useCase.execute(input);
    
            expect(output.status).toBe('completed');
            expect(output).toMatchObject({
                id: enrollment.entityId.id,
                student_id: enrollment.student_id,
                class_id: enrollment.class_id,
                enrollment_date: enrollment.enrollment_date,
                status: 'completed'
            });
        });
    
        it('should throw error when enrollment not found', async () => {
            const input: UpdateEnrollmentInput = {
                id: new Uuid().id,
                status: 'completed'
            };
    
            await expect(useCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });

    describe("FindEnrollmentUseCase integration tests", () => {
        let useCase: FindEnrollmentUseCase;
    
        setupSequelize({ models: [EnrollmentModel] });
    
        beforeEach(() => {
            repository = new EnrollmentSequelizeRepository(EnrollmentModel);
            useCase = new FindEnrollmentUseCase(repository);
        });
    
        it('should find an enrollment by id', async () => {
            const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
            await repository.create(enrollment);
    
            const input = { id: enrollment.entityId.id };
            const output = await useCase.execute(input);
    
            expect(output).toStrictEqual(EnrollmentOutputMapper.toOutput(enrollment));
        });
    
        it('should throw error when enrollment not found', async () => {
            const input = { id: new Uuid().id };
            await expect(useCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });

    describe("FindAllEnrollmentsUseCase integration tests", () => {
        let useCase: FindAllEnrollmentsUseCase;
    
        setupSequelize({ models: [EnrollmentModel] });
    
        beforeEach(() => {
            repository = new EnrollmentSequelizeRepository(EnrollmentModel);
            useCase = new FindAllEnrollmentsUseCase(repository);
        });
    
        it('should return all enrollments', async () => {
            const enrollment1 = EnrollmentFakeBuilder.anEnrollment().build();
            const enrollment2 = EnrollmentFakeBuilder.anEnrollment().build();
            await repository.create(enrollment1);
            await repository.create(enrollment2);
    
            const output = await useCase.execute();
            expect(output).toHaveLength(2);
            expect(output).toEqual(expect.arrayContaining([
                EnrollmentOutputMapper.toOutput(enrollment1),
                EnrollmentOutputMapper.toOutput(enrollment2),
            ]));
        });
    
        it('should find enrollments by ids', async () => {
            const enrollment1 = EnrollmentFakeBuilder.anEnrollment().build();
            const enrollment2 = EnrollmentFakeBuilder.anEnrollment().build();
            await repository.create(enrollment1);
            await repository.create(enrollment2);
    
            const input = { ids: [enrollment1.entityId.id, enrollment2.entityId.id] };
            const output = await useCase.execute(input);
            expect(output).toHaveLength(2);
            expect(output).toEqual(expect.arrayContaining([
                EnrollmentOutputMapper.toOutput(enrollment1),
                EnrollmentOutputMapper.toOutput(enrollment2),
            ]));
        });
    
        it('should throw error when no enrollments found', async () => {
            const input = { ids: [new Uuid().id] };
            await expect(useCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });

    describe("FindEnrollmentByStudentUsecase integration tests", () => {
        let useCase: FindEnrollmentByStudentUsecase;
    
        setupSequelize({ models: [EnrollmentModel] });
    
        beforeEach(() => {
            repository = new EnrollmentSequelizeRepository(EnrollmentModel);
            useCase = new FindEnrollmentByStudentUsecase(repository);
        });
    
        it('should find an enrollment by student ID', async () => {
            const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
            await repository.create(enrollment);
    
            const input = { student_id: enrollment.student_id };
            const output = await useCase.execute(input);
    
            expect(output).toBeTruthy();
            expect(output).toMatchObject({
                id: enrollment.entityId.id,
                student_id: enrollment.student_id,
                class_id: enrollment.class_id,
                enrollment_date: enrollment.enrollment_date,
                status: enrollment.status.type
            });
        });
    
        it('should throw error if enrollment by student ID is not found', async () => {
            const input = { student_id: new Uuid().id };
    
            await expect(useCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });

    describe("FindEnrollmentsByClassRoomUsecase integration tests", () => {
        let useCase: FindEnrollmentsByClassRoomUsecase;
    
        setupSequelize({ models: [EnrollmentModel] });
    
        beforeEach(() => {
            repository = new EnrollmentSequelizeRepository(EnrollmentModel);
            useCase = new FindEnrollmentsByClassRoomUsecase(repository);
        });
    
        it('should find enrollments by class ID', async () => {
            const enrollment1 = EnrollmentFakeBuilder.anEnrollment().withClassId("675e8a19-de0a-4827-a894-1241a283d5d0").build();
            const enrollment2 = EnrollmentFakeBuilder.anEnrollment().withClassId("34799a41-2930-4e4c-bffb-49df5afe9a8d").build();
            const enrollment3 = EnrollmentFakeBuilder.anEnrollment().withClassId("34799a41-2930-4e4c-bffb-49df5afe9a8d").build();
    
            await repository.create(enrollment1);
            await repository.create(enrollment2);
            await repository.create(enrollment3);
    
            const output = await useCase.execute({class_id: "34799a41-2930-4e4c-bffb-49df5afe9a8d"});
    
            expect(output).toHaveLength(2);
            expect(output).toEqual(expect.arrayContaining([
                {
                    id: enrollment2.entityId.id,
                    student_id: enrollment2.student_id,
                    class_id: enrollment2.class_id,
                    enrollment_date: enrollment2.enrollment_date,
                    status: enrollment2.status.type,
                    created_at: enrollment2.createdAt,
                    updated_at: enrollment2.updatedAt
                },
                {
                    id: enrollment2.entityId.id,
                    student_id: enrollment2.student_id,
                    class_id: enrollment2.class_id,
                    enrollment_date: enrollment2.enrollment_date,
                    status: enrollment2.status.type,
                    created_at: enrollment2.createdAt,
                    updated_at: enrollment2.updatedAt
                }
            ]));
        });
    
        it('should throw error if no enrollments are found by class ID', async () => {
            const input = { class_id: new Uuid().id };
    
            await expect(useCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });

    describe("DeleteEnrollmentUseCase integration tests", () => {
        let useCase: DeleteEnrollmentUseCase;

        setupSequelize({ models: [EnrollmentModel] });

        beforeEach(() => {
            repository = new EnrollmentSequelizeRepository(EnrollmentModel);
            useCase = new DeleteEnrollmentUseCase(repository);
        });

        it('should delete an enrollment', async () => {
            const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
            await repository.create(enrollment);

            await useCase.execute({ id: enrollment.entityId.id });

            const enrollmentFound = await repository.find(new Uuid(enrollment.entityId.id));
            expect(enrollmentFound).toBeNull();
        })

        it('should throw error when enrollment not found', async () => {
            const input = new Uuid().id
            await expect(useCase.execute({ id: input })).rejects.toThrow(CustomNotFoundError);
        });
    });
})