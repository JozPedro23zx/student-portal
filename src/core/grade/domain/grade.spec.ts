import { Grade } from '@core/grade/domain/grade.entity';
import { Subject } from './value-object/subject.vo';
import { GradeValidatorFactory } from './grade.validator';

describe('Grade Entity', () => {
    it('should create a grade entity', () => {
        const grade = new Grade({
            student_id: 'student-1',
            subject: Subject.create('math'),
            exam: 8,
            assignment: 7,
            others: 9,
        });

        expect(grade).toBeDefined();
        expect(grade.subject.type).toBe('math');
        expect(grade.exam).toBe(8);
        expect(grade.assignment).toBe(7);
        expect(grade.others).toBe(9);
    });

    it('should manage exam grade', () => {
        const grade = new Grade({
            student_id: 'student-1',
            subject: Subject.create('math'),
            exam: 8,
            assignment: 7,
            others: 9,
        });

        grade.manageExamGrade(10);
        expect(grade.exam).toBe(10);
    });

    it('should manage assignment grade', () => {
        const grade = new Grade({
            student_id: 'student-1',
            subject: Subject.create('math'),
            exam: 8,
            assignment: 7,
            others: 9,
        });

        grade.manageAssignmentGrade(9);
        expect(grade.assignment).toBe(9);
    });

    it('should manage others grade', () => {
        const grade = new Grade({
            student_id: 'student-1',
            subject: Subject.create('math'),
            exam: 8,
            assignment: 7,
            others: 9,
        });

        grade.manageOthersGrade(8);
        expect(grade.others).toBe(8);
    });

    it('should calculate the average grade', () => {
        const grade = new Grade({
            student_id: 'student-1',
            subject: Subject.create('math'),
            exam: 8,
            assignment: 7,
            others: 9,
        });

        expect(grade.getGrade()).toBe(8);
    });

    it('should validate grades', () => {
        const grade = new Grade({
            student_id: 'student-1',
            subject: Subject.create('math'),
            exam: 8,
            assignment: 7,
            others: 9,
        });

        grade.validate();

        expect(grade.notifications.hasErrors()).toBe(false);
    });

    it('should fail validation if grades are out of range', () => {
        const grade = new Grade({
            student_id: 'student-1',
            subject: Subject.create('math'),
            exam: 15,
            assignment: -12,
            others: 9,
        });

        grade.validate();

        console.log(grade.notifications.messages())

        expect(grade.notifications.hasErrors()).toBe(true);
    });

    it('should convert grade entity to JSON', () => {
        const grade = new Grade({
            student_id: 'student-1',
            subject: Subject.create('math'),
            exam: 8,
            assignment: 7,
            others: 9,
        });

        const json = grade.toJson();

        expect(json).toEqual({
            id: grade.entityId.id,
            student_id: 'student-1',
            subject: "math",
            exam: 8,
            assignment: 7,
            others: 9,
            createdAt: grade.createdAt,
            updatedAt: grade.updatedAt,
        });
    });
});
