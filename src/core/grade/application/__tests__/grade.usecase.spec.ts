import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CreateGradeUsecase } from "../create-grade/create-grade";
import { GradeSequelizeRepository } from "@core/grade/infrastructure/sequelize/grade-sequelize.repository";
import CreateGradeInput from "../create-grade/input-create-grade";
import { GradeModel } from "@core/grade/infrastructure/sequelize/grade.model";
import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { FindGradeUsecase, FindGradeUsecaseInput } from "../find-grade/find-grade.usecase";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { Grade } from "@core/grade/domain/grade.entity";
import { Subject } from "@core/grade/domain/value-object/subject.vo";
import { FindAllGradesUsecase, FindAllGradesUsecaseInput } from "../find-grade/find-all-grade.usecase";
import { UpdateGradeUsecase } from "../update-grade/update-grade.usecase";
import { DeleteGradeUsecase, DeleteGradeUsecaseInput } from "../delete-grade/delete-grade.usecase";

describe("Grade usecase integration tests", ()=>{
    let repository: GradeSequelizeRepository;

    setupSequelize({ models: [GradeModel] });

    describe('Create grade use case', () => {
        let usecase: CreateGradeUsecase;

        beforeEach(() => {
            repository = new GradeSequelizeRepository(GradeModel)
            usecase = new CreateGradeUsecase(repository);
        });

        it('should create a grade', async () => {
            const input: CreateGradeInput = {
                student_id: 'student-id',
                subject: "math",
                exam: 8,
                assignment: 7,
                others: 9,
            };

            const output = await usecase.execute(input);

            const entity = await repository.find(new Uuid(output.id));

            expect(output.id).toBe(entity.entityId.id);
            expect(output.student_id).toBe(entity.student_id);
            expect(output.subject).toBe(entity.subject.type);
            expect(output.exam).toBe(entity.exam);
            expect(output.assignment).toBe(entity.assignment);
            expect(output.others).toBe(entity.others);

            expect(new Date(output.createdAt).getTime()).toBeCloseTo(new Date(entity.createdAt).getTime(), -2);
            expect(new Date(output.updatedAt).getTime()).toBeCloseTo(new Date(entity.updatedAt).getTime(), -2);
        });
    });

    describe('Find grade use case', () => {
        let findUseCase: FindGradeUsecase;

        beforeEach(() => {
            repository = new GradeSequelizeRepository(GradeModel)
            findUseCase = new FindGradeUsecase(repository);
        });

        it('should find a grade', async () => {
            const grade = new Grade({
                student_id: 'student-id',
                subject: Subject.create("math"),
                exam: 8,
                assignment: 7,
                others: 9,
            });

            await repository.create(grade);

            const input: FindGradeUsecaseInput = { id: grade.entityId.id };
            const output = await findUseCase.execute(input);

            expect(output.id).toBe(grade.entityId.id);
            expect(output.student_id).toBe(grade.student_id);
            expect(output.subject).toBe(grade.subject.type);
            expect(output.exam).toBe(grade.exam);
            expect(output.assignment).toBe(grade.assignment);
            expect(output.others).toBe(grade.others);
        });

        it('should throw not found error for invalid grade id', async () => {
            const input: FindGradeUsecaseInput = { id: '352d7095-c7c0-44d0-b5b6-86cb684ddd01' };

            await expect(findUseCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });
    
    describe('Find all grades use case', () => {
        let findAllUseCase: FindAllGradesUsecase;

        beforeEach(() => {
            repository = new GradeSequelizeRepository(GradeModel)
            findAllUseCase = new FindAllGradesUsecase(repository);
        });

        it('should find all grades', async () => {
            const grades = [
                new Grade({
                    student_id: 'student-id-1',
                    subject: Subject.create("math"),
                    exam: 8,
                    assignment: 7,
                    others: 9,
                }),
                new Grade({
                    student_id: 'student-id-2',
                    subject: Subject.create("math"),
                    exam: 7,
                    assignment: 6,
                    others: 8,
                }),
            ];

            for (const grade of grades) {
                await repository.create(grade);
            }

            const input: FindAllGradesUsecaseInput = {};
            const output = await findAllUseCase.execute(input);

            expect(Array.isArray(output)).toBe(true);
            expect(output.length).toBe(grades.length);

            output.forEach((outputGrade, index) => {
                const grade = grades[index];

                expect(outputGrade.id).toBe(grade.entityId.id);
                expect(outputGrade.student_id).toBe(grade.student_id);
                expect(outputGrade.subject).toBe(grade.subject.type);
                expect(outputGrade.exam).toBe(grade.exam);
                expect(outputGrade.assignment).toBe(grade.assignment);
                expect(outputGrade.others).toBe(grade.others);
            });
        })

        it('should find grades by specific ids', async () => {
            const grades = [
                new Grade({
                    student_id: 'student-id-1',
                    subject: Subject.create("math"),
                    exam: 8,
                    assignment: 7,
                    others: 9,
                }),
                new Grade({
                    student_id: 'student-id-2',
                    subject: Subject.create("math"),
                    exam: 7,
                    assignment: 6,
                    others: 8,
                }),
            ];

            for (const grade of grades) {
                await repository.create(grade);
            }

            const input: FindAllGradesUsecaseInput = { ids: [grades[0].entityId.id] };
            const output = await findAllUseCase.execute(input);

            expect(Array.isArray(output)).toBe(true);
            expect(output.length).toBe(1);

            const expectedGrade = grades.find(g => g.entityId.id === input.ids[0]);
            expect(output[0].id).toBe(expectedGrade.entityId.id);
            expect(output[0].student_id).toBe(expectedGrade.student_id);
            expect(output[0].subject).toBe(expectedGrade.subject.type);
            expect(output[0].exam).toBe(expectedGrade.exam);
            expect(output[0].assignment).toBe(expectedGrade.assignment);
            expect(output[0].others).toBe(expectedGrade.others);
        });

        it('should throw not found error for empty list of ids', async () => {
            const input: FindAllGradesUsecaseInput = { ids: [] };

            await expect(findAllUseCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });

        it('should throw not found error for invalid list of ids', async () => {
            const input: FindAllGradesUsecaseInput = { ids: ['352d7095-c7c0-44d0-b5b6-86cb684ddd01', 'c4174860-3173-4df4-bc9f-2705eef08ba9'] };

            await expect(findAllUseCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    })

    describe('Update grade use case', () => {
        let updateUseCase: UpdateGradeUsecase;

        beforeEach(() => {
            repository = new GradeSequelizeRepository(GradeModel)
            updateUseCase = new UpdateGradeUsecase(repository);
        });

        it('should update a grade', async () => {
            const grade = new Grade({
                student_id: 'e96e021a-9fd4-4d75-9f5d-3ce3253dd252',
                subject: Subject.create("math"),
                exam: 8,
                assignment: 7,
                others: 9,
            });

            await repository.create(grade);

            const input = {
                id: grade.entityId.id,
                exam: 9,
            };

            const output = await updateUseCase.execute(input);

            expect(output.id).toBe(grade.entityId.id);
            expect(output.student_id).toBe(grade.student_id);
            expect(output.subject).toBe(grade.subject.type);
            expect(output.exam).toBe(input.exam);
            expect(output.assignment).toBe(grade.assignment);
            expect(output.others).toBe(grade.others);
        });

        it('should throw not found error for invalid grade id', async () => {
            const input = {
                id: 'e96e021a-9fd4-4d75-9f5d-3ce3253dd252',
                exam: 9,
            };

            await expect(updateUseCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });

    describe('Delete grade use case', () => {
        let deleteUseCase: DeleteGradeUsecase;

        beforeEach(() => {
            repository = new GradeSequelizeRepository(GradeModel)
            deleteUseCase = new DeleteGradeUsecase(repository);
        });

        it('should delete a grade', async () => {
            const grade = new Grade({
                student_id: 'e96e021a-9fd4-4d75-9f5d-3ce3253dd252',
                subject: Subject.create("math"),
                exam: 8,
                assignment: 7,
                others: 9,
            });

            await repository.create(grade);

            const input: DeleteGradeUsecaseInput = { id: grade.entityId.id };
            await deleteUseCase.execute(input);

            await expect(repository.find(new Uuid(input.id))).resolves.toBeNull();
        });

        it('should throw not found error for invalid grade id', async () => {
            const input: DeleteGradeUsecaseInput = { id: 'e96e021a-9fd4-4d75-9f5d-3ce3253dd252' };

            await expect(deleteUseCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });

})