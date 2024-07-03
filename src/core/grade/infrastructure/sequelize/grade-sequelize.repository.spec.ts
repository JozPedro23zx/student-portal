import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Grade } from "@core/grade/domain/grade.entity";
import { Sequelize } from "sequelize";
import { GradeSequelizeRepository } from "./grade-sequelize.repository";
import { GradeModel } from "./grade.model";
import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { Subjects } from "@core/teacher/domain/value-object/subject.vo";
import { Subject } from "@core/grade/domain/value-object/subject.vo";
import { StudentModel } from "@core/student/infrastructure/sequelize/student.model";

describe('GradeSequelizeRepository', () => {
    let repository: GradeSequelizeRepository;

    setupSequelize({ models: [GradeModel] });

    beforeAll(async () => {
        repository = new GradeSequelizeRepository(GradeModel);
    });

    const createGrade = () => {
        const subject = new Subject(Subjects.MATH);
        const grade = new Grade({
            id: new Uuid(),
            student_id: 'student-uuid',
            subject: subject,
            exam: 8,
            assignment: 7,
            others: 9,
        });
        return grade;
    };

    it('should create a grade', async () => {
        const grade = createGrade();

        await repository.create(grade);

        const found = await GradeModel.findByPk(grade.entityId.id);
        expect(found).toBeTruthy();
        expect(found!.id).toBe(grade.entityId.id);
        expect(found!.subject).toBe(grade.subject.type);
        expect(found!.exam).toBe(grade.exam);
        expect(found!.assignment).toBe(grade.assignment);
        expect(found!.others).toBe(grade.others);
    });

    it('should update a grade', async () => {
        const grade = createGrade();

        await repository.create(grade);

        grade.manageExamGrade(9);
        grade.manageAssignmentGrade(8);
        grade.manageOthersGrade(10);

        await repository.update(grade);

        const found = await GradeModel.findByPk(grade.entityId.id);
        expect(found).toBeTruthy();
        expect(found!.exam).toBe(9);
        expect(found!.assignment).toBe(8);
        expect(found!.others).toBe(10);
    });

    it('should delete a grade', async () => {
        const grade = createGrade();

        await repository.create(grade);

        await repository.delete(grade.entityId);

        const found = await GradeModel.findByPk(grade.entityId.id);
        expect(found).toBeNull();
    });

    it('should find a grade by id', async () => {
        const grade = createGrade();

        await repository.create(grade);

        const found = await repository.find(grade.entityId);
        expect(found).toBeTruthy();
        expect(found!.entityId.id).toBe(grade.entityId.id);
    });

    it('should find grades by ids', async () => {
        const grade1 = createGrade();
        const grade2 = createGrade();

        await repository.create(grade1);
        await repository.create(grade2);

        const found = await repository.findByIds([grade1.entityId, grade2.entityId]);
        expect(found).toHaveLength(2);
    });

    it('should find all grades', async () => {
        const grade1 = createGrade();
        const grade2 = createGrade();

        await repository.create(grade1);
        await repository.create(grade2);

        const found = await repository.findAll();
        expect(found).toHaveLength(2);
    });
});