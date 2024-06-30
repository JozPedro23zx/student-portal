
import { Uuid } from '@core/@shared/domain/value-object/uuid.vo';
import { ClassRoom } from './calssroom.entity';

describe('ClassRoom Entity', () => {
    it('should create a classroom entity', () => {
        const id = new Uuid();
        const grade_level = '5th Grade';
        const start_date = new Date('2024-01-01');
        const end_date = new Date('2024-12-01');

        const classroom = new ClassRoom({ id, grade_level, start_date, end_date });

        expect(classroom.entityId.id).toBe(id.id);
        expect(classroom.grade_level).toBe(grade_level);
        expect(classroom.start_date).toBe(start_date);
        expect(classroom.end_date).toBe(end_date);
    });

    it('should change the grade level', () => {
        const id = new Uuid();
        const grade_level = '5th Grade';
        const start_date = new Date('2024-01-01');
        const end_date = new Date('2024-12-01');

        const classroom = new ClassRoom({ id, grade_level, start_date, end_date });
        classroom.changeGradeLevel('6th Grade');

        expect(classroom.grade_level).toBe('6th Grade');
    });

    it('should change the start date', () => {
        const id = new Uuid();
        const grade_level = '5th Grade';
        const start_date = new Date('2024-01-01');
        const end_date = new Date('2024-12-01');

        const classroom = new ClassRoom({ id, grade_level, start_date, end_date });
        const new_start_date = new Date('2024-02-01');
        classroom.changeStartDate(new_start_date);

        expect(classroom.start_date).toBe(new_start_date);
    });

    it('should change the end date', () => {
        const id = new Uuid();
        const grade_level = '5th Grade';
        const start_date = new Date('2024-01-01');
        const end_date = new Date('2024-12-01');

        const classroom = new ClassRoom({ id, grade_level, start_date, end_date });
        const new_end_date = new Date('2024-11-01');
        classroom.changeEndDate(new_end_date);

        expect(classroom.end_date).toBe(new_end_date);
    });

    it('should validate date period', () => {
        const id = new Uuid();
        const grade_level = '5th Grade';
        const start_date = new Date('2024-01-01');
        const end_date = new Date('2025-12-01');

        const classroom = new ClassRoom({ id, grade_level, start_date, end_date });
        classroom.validateDate();

        expect(classroom.notifications.hasErrors()).toBe(true);
    });

    it('should return JSON representation', () => {
        const id = new Uuid();
        const grade_level = '5th Grade';
        const start_date = new Date('2024-01-01');
        const end_date = new Date('2024-12-01');

        const classroom = new ClassRoom({ id, grade_level, start_date, end_date });

        const json = classroom.toJSON();

        expect(json).toEqual({
            id: id.id,
            grade_level: grade_level,
            start_date: start_date,
            end_date: end_date
        });
    });
});
