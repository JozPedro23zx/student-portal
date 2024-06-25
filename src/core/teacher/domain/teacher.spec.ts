import { Teacher, TeacherProps } from './teacher.entity';
import { Subject, Subjects } from './value-object/subject.vo';
import { Uuid } from '@core/@shared/domain/value-object/uuid.vo';
import { Address } from './value-object/address.vo';

describe('Teacher Entity', () => {
    let teacherProps: TeacherProps;

    beforeEach(() => {
        const address = new Address({
            street: "Street",
            number: 400,
            city: "City",
        });

        teacherProps = {
            id: new Uuid(),
            first_name: 'John',
            last_name: 'Doe',
            subject_specialization: [Subject.create(Subjects.MATH)],
            date_of_birth: new Date('1980-01-01'),
            address: address,
            phone_number: '123-456-7890',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    });

    it('should create a Teacher instance', () => {
        const teacher = new Teacher(teacherProps);
        expect(teacher).toBeInstanceOf(Teacher);
        expect(teacher.first_name).toBe('John');
        expect(teacher.last_name).toBe('Doe');
        expect(teacher.subject_specialization.length).toBe(1);
        expect(teacher.subject_specialization[0].type).toBe(Subjects.MATH);
        expect(teacher.date_of_birth).toEqual(new Date('1980-01-01'));
        expect(teacher.address.street).toBe('Street');
        expect(teacher.phone_number).toBe('123-456-7890');
    });

    it('should add a subject specialization', () => {
        const teacher = new Teacher(teacherProps);
        const science = Subject.create(Subjects.SCIENCE);
        teacher.addSubjectSpecialization(science);
        expect(teacher.subject_specialization.length).toBe(2);
        expect(teacher.subject_specialization[1].type).toBe(Subjects.SCIENCE);
    });

    it('should not add a duplicate subject specialization', () => {
        const teacher = new Teacher(teacherProps);
        const math = Subject.create(Subjects.MATH);
        teacher.addSubjectSpecialization(math);
        expect(teacher.subject_specialization.length).toBe(1);
    });

    it('should remove a subject specialization', () => {
        const teacher = new Teacher(teacherProps);
        const math = Subject.create(Subjects.MATH);
        teacher.removeSubjectSpecialization(math);
        expect(teacher.subject_specialization.length).toBe(0);
    });

    it('should change the teacher\'s name', () => {
        const teacher = new Teacher(teacherProps);
        teacher.changeName('Jane', 'Smith');
        expect(teacher.first_name).toBe('Jane');
        expect(teacher.last_name).toBe('Smith');
    });

    it('should change the teacher\'s birthday', () => {
        const teacher = new Teacher(teacherProps);
        const newBirthday = new Date('1990-01-01');
        teacher.changeBirthday(newBirthday);
        expect(teacher.date_of_birth).toEqual(newBirthday);
    });

    it('should change the teacher\'s address', () => {
        const teacher = new Teacher(teacherProps);
        const newAddress = new Address({
            street: "Street 2",
            number: 800,
            city: "City 2",
        });

        teacher.changeAddress(newAddress);
        expect(teacher.address.street).toBe('Street 2');
        expect(teacher.address.number).toBe(800);
        expect(teacher.address.city).toBe('City 2');
    });

    it('should change the teacher\'s phone number', () => {
        const teacher = new Teacher(teacherProps);
        const newPhoneNumber = '987-654-3210';
        teacher.changePhone(newPhoneNumber);
        expect(teacher.phone_number).toBe(newPhoneNumber);
    });

    it("invalid name", ()=>{
        const address = new Address({
            street: "Street",
            number: 400,
            city: "City",
        });

        teacherProps = {
            id: new Uuid(),
            first_name: null,
            last_name: undefined,
            subject_specialization: [Subject.create(Subjects.MATH)],
            date_of_birth: new Date('1980-01-01'),
            address: address,
            phone_number: '123-456-7890',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        let student = new Teacher(teacherProps);

        student.validate();

        expect(student.notifications.hasErrors()).toBe(true);
    })
});
