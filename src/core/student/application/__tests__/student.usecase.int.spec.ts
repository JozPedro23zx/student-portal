import { CreateStudentUsecase } from "../create-student/create-student.usecase";
import { StudentModel } from "@core/student/infrastructure/sequelize/student.model";
import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { StudentSequelizeRepository } from "@core/student/infrastructure/sequelize/student-sequelize.repository";
import { UpdateStudentUsecase } from "../update-student/update-student.usecase";
import { Address } from "@core/student/domain/value-object/address.vo";
import { Student, StudentProps } from "@core/student/domain/student.entity";
import { DeleteStudentUsecase } from "../delete-student/delete-student";
import { FindStudentUsecase } from "../find-student/find-student.usecase";

describe("Student use-case integration tests", ()=>{
    let repository: StudentSequelizeRepository;

    setupSequelize({ models: [StudentModel] });


    describe("Creat student usecase", ()=>{
        let usecase: CreateStudentUsecase;

        beforeEach(()=>{
            repository = new StudentSequelizeRepository(StudentModel);
            usecase = new CreateStudentUsecase(repository);
        })

        it("should create a student", async ()=>{
            const input = {
                "first_name": "Jon",
                "last_name": "Silver",
                "date_of_birth": new Date("1999-05-14"), 
                "street": "Flower Street",
                "number": 123,
                "city": "Old York",
                "phone_number": "12345-6789"
            };
    
            let output = await usecase.execute(input);
    
            let entity = await repository.find(new Uuid(output.id));
    
            expect(output.id).toBe(entity.entityId.id);
            expect(output.first_name).toBe(entity.first_name);
            expect(output.last_name).toBe(entity.last_name);
            expect(output.date_of_birth.toISOString()).toBe(entity.date_of_birth.toISOString());
            expect(output.street).toBe(entity.address.street);
            expect(output.number).toBe(entity.address.number);
            expect(output.city).toBe(entity.address.city);
            expect(output.phone_number).toBe(entity.phone_number);
        
            expect(Math.floor(new Date(output.createdAt).getTime() / 1000)).toBe(Math.floor(new Date(entity.createdAt).getTime() / 1000));
            expect(Math.floor(new Date(output.updatedAt).getTime() / 1000)).toBe(Math.floor(new Date(entity.updatedAt).getTime() / 1000));
    
    
        })
    })

    describe("Find student usecase", ()=>{
        let findUseCase: FindStudentUsecase;

        beforeEach(()=>{
            repository = new StudentSequelizeRepository(StudentModel);
            findUseCase = new FindStudentUsecase(repository);
        })
        
        it("should delete a student", async ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const createdAt = new Date();
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1999, 11, 17),
                address: address,
                phone_number: "99 9999-9999",
                createdAt: createdAt,
                updatedAt: createdAt
            };
    
            let student = new Student(inputStudentProps);

            await repository.create(student);

            const output = await findUseCase.execute({id: student.entityId.id});

            expect(output.id).toBe(student.entityId.id);
            expect(output.first_name).toBe(student.first_name);
            expect(output.last_name).toBe(student.last_name);
            expect(output.date_of_birth.toISOString()).toBe(student.date_of_birth.toISOString());
            expect(output.street).toBe(student.address.street);
            expect(output.number).toBe(student.address.number);
            expect(output.city).toBe(student.address.city);
            expect(output.phone_number).toBe(student.phone_number);
        })
    })

    describe("Update student usecase", ()=>{
        let updateUseCase: UpdateStudentUsecase;

        beforeEach(()=>{
            repository = new StudentSequelizeRepository(StudentModel);
            updateUseCase = new UpdateStudentUsecase(repository);
        })
        
        it("should update a student", async ()=>{
            type Arrange = {
                input:{
                    id: string;
                    first_name?: string;
                    last_name?: string;
                    date_of_birth?: Date;
                    address?: {
                        street: string;
                        number: number;
                        city: string;
                    };
                    phone_number?: string;                    
                };
                expected:{
                    id: string;
                    first_name: string;
                    last_name: string;
                    date_of_birth: Date;
                    street: string;
                    number: number;
                    city: string;
                    phone_number: string;
                    createdAt: Date;
                    updatedAt: Date;                    
                }
            }

            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const createdAt = new Date();
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1999, 11, 17),
                address: address,
                phone_number: "99 9999-9999",
                createdAt: createdAt,
                updatedAt: createdAt
            };
    
            let student = new Student(inputStudentProps);

            repository.create(student);
            
            const arrange: Arrange[] = [
                {
                    input: {
                        id: student.entityId.id,
                        first_name: "Michael",
                    },
                    expected: {
                        id: student.entityId.id,
                        first_name: "Michael",
                        last_name: "Joseph",
                        date_of_birth: new Date(1999, 11, 17),
                        street: "Street",
                        number: 400,
                        city: "City",
                        phone_number: "99 9999-9999",
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }
                },
                {
                    input: {
                        id: student.entityId.id,
                        last_name: "Smith",
                    },
                    expected: {
                        id: student.entityId.id,
                        first_name: "Michael",
                        last_name: "Smith",
                        date_of_birth: new Date(1999, 11, 17),
                        street: "Street",
                        number: 400,
                        city: "City",
                        phone_number: "99 9999-9999",
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }
                },
                {
                    input: {
                        id: student.entityId.id,
                        date_of_birth: new Date(2001, 5, 20),
                    },
                    expected: {
                        id: student.entityId.id,
                        first_name: "Michael",
                        last_name: "Smith",
                        date_of_birth: new Date(2001, 5, 20),
                        street: "Street",
                        number: 400,
                        city: "City",
                        phone_number: "99 9999-9999",
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }
                },
                {
                    input: {
                        id: student.entityId.id,
                        address: {
                            street: "New Street",
                            number: 500,
                            city: "New City",
                        },
                    },
                    expected: {
                        id: student.entityId.id,
                        first_name: "Michael",
                        last_name: "Smith",
                        date_of_birth: new Date(2001, 5, 20),
                        street: "New Street",
                        number: 500,
                        city: "New City",
                        phone_number: "99 9999-9999",
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }
                },
                {
                    input: {
                        id: student.entityId.id,
                        phone_number: "88 8888-8888",
                    },
                    expected: {
                        id: student.entityId.id,
                        first_name: "Michael",
                        last_name: "Smith",
                        date_of_birth: new Date(2001, 5, 20),
                        street: "New Street",
                        number: 500,
                        city: "New City",
                        phone_number: "88 8888-8888",
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }
                },
                {
                    input: {
                        id: student.entityId.id,
                        first_name: "Jony",
                        last_name: "Joseph",
                        date_of_birth: new Date(1999, 5, 20),
                        address: {
                            street: "Old Street",
                            number: 400,
                            city: "Old City",
                        },
                        phone_number: "99 9999-9999",
                    },
                    expected: {
                        id: student.entityId.id,
                        first_name: "Jony",
                        last_name: "Joseph",
                        date_of_birth: new Date(1999, 5, 20),
                        street: "Old Street",
                        number: 400,
                        city: "Old City",
                        phone_number: "99 9999-9999",
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }
                }
            ];

            for (const a of arrange) {
              let input = a.input;
              let expected = a.expected;

              let output = await updateUseCase.execute({
                id: input.id,
                ...('first_name' in input && {first_name: input.first_name}),
                ...('last_name' in input && {last_name: input.last_name}),
                ...('date_of_birth' in input && {date_of_birth: input.date_of_birth}),
                ...('address' in input && {address: input.address}),
                ...('phone_number' in input && {phone_number: input.phone_number})
              })

              const studentUpdated = await repository.find(student.entityId)

              expect(output).toStrictEqual({
                id: student.entityId.id,
                first_name: expected.first_name,
                last_name: expected.last_name,
                date_of_birth: expected.date_of_birth,
                street: expected.street,
                number: expected.number,
                city: expected.city,
                phone_number: expected.phone_number,
                createdAt: expected.createdAt,
                updatedAt: expected.updatedAt,
              })

              expect(studentUpdated.entityId.id).toBe(student.entityId.id);
              expect(studentUpdated.first_name).toBe(expected.first_name);
              expect(studentUpdated.last_name).toBe(expected.last_name);
              expect(studentUpdated.date_of_birth.toISOString()).toBe(expected.date_of_birth.toISOString());
              expect(studentUpdated.address.street).toBe(expected.street);
              expect(studentUpdated.address.number).toBe(expected.number);
              expect(studentUpdated.address.city).toBe(expected.city);
              expect(studentUpdated.phone_number).toBe(expected.phone_number);
            }
        })
    })

    describe("Delete student usecase", ()=>{
        let deleteUseCase: DeleteStudentUsecase;

        beforeEach(()=>{
            repository = new StudentSequelizeRepository(StudentModel);
            deleteUseCase = new DeleteStudentUsecase(repository);
        })
        
        it("should delete a student", async ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const createdAt = new Date();
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1999, 11, 17),
                address: address,
                phone_number: "99 9999-9999",
                createdAt: createdAt,
                updatedAt: createdAt
            };
    
            let student = new Student(inputStudentProps);

            await repository.create(student);
            
            await deleteUseCase.execute({id: student.entityId.id});

            await expect(repository.find(student.entityId)).resolves.toBeNull();
        })
    })
})