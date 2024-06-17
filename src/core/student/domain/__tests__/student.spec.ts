import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Student, StudentProps } from "../student.entity"
import { Address } from "../value-object/address.vo"
import { ValidationError } from "class-validator";

describe('Student unit tests', ()=>{
    beforeEach(()=>{
        Student.prototype.validate = jest.fn().mockImplementation(Student.prototype.validate);
    })

    describe('Constructor of Stundet', ()=>{
        test("create student", ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1995, 11, 17),
                address: address,
                phone_number: "99 9999-9999"
            };
    
            let student = new Student(inputStudentProps);
    
            expect(student.entityId).toBeDefined();
            expect(student.entityId).toBeInstanceOf(Uuid);
            expect(student.entityId.id).toBeDefined();
            expect(student.first_name).toBe(inputStudentProps.first_name);
            expect(student.last_name).toBe(inputStudentProps.last_name);
            expect(student.date_of_birth).toBe(inputStudentProps.date_of_birth);
            expect(student.address).toBe(address);
            expect(student.phone_number).toBe(inputStudentProps.phone_number);
            expect(student.createdAt).toBeDefined();
            expect(student.updatedAt).toBeDefined();
        })
    
        test("change student name", ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1995, 11, 17),
                address: address,
            };
    
            let student = new Student(inputStudentProps);

            student.changeName(null, "Rich");
    
    
            expect(student.first_name).toBe("Jony");
            expect(student.last_name).toBe("Rich");
            expect(Student.prototype.validate).toHaveBeenCalledTimes(1);
        })

        test("change updatedAt", ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1995, 11, 17),
                address: address,
            };
    
            let student = new Student(inputStudentProps);
            let legacyUpdateAt = student.updatedAt;
            student.changeName(null, "Rich");
    
    
            expect(student.first_name).toBe("Jony");
            expect(student.last_name).toBe("Rich");
            expect(student.updatedAt).not.toBe(legacyUpdateAt);
            expect(Student.prototype.validate).toHaveBeenCalledTimes(1);
        })
    
        test("change student date", ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1995, 11, 17),
                address: address,
            };
    
            let student = new Student(inputStudentProps);
    
            const date2 = new Date(2001, 11, 17)
            student.changeBirthday(date2);
    
            expect(student.date_of_birth).toBe(date2);
            expect(Student.prototype.validate).toHaveBeenCalledTimes(1);
        })
    
        test("change student address", ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1995, 11, 17),
                address: address,
            };
    
            let student = new Student(inputStudentProps);
    
           
            const address2 = new Address({
                street: "Street",
                number: 800,
                city: "City",
            });
    
            student.changeAddress(address2)
    
            expect(student.address).toBe(address2);
        })
    
        test("change student phone", ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1995, 11, 17),
                address: address,
            };
    
            let student = new Student(inputStudentProps);
    
            student.changePhone("99 9999-9999")
    
            expect(student.phone_number).toBe("99 9999-9999");
        })
    })

    describe('Domain of Student', ()=>{
        test("invalid date", ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(2015, 11, 17),
                address: address,
                phone_number: "99 9999-9999"
            };
    
            let student = new Student(inputStudentProps);

            student.validate(['date']);

            expect(student.notifications.hasErrors()).toBe(true);
        })

        test("invalid name", ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                first_name: null,
                last_name: undefined,
                date_of_birth: new Date(2015, 11, 17),
                address: address,
                phone_number: "99 9999-9999"
            };
    
            let student = new Student(inputStudentProps);

            student.validate(['name']);

            expect(student.notifications.hasErrors()).toBe(true);
        })
    })

})