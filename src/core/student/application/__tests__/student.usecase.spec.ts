import { StudentRepositoryInMemory } from "@core/student/infrastructure/in-memory/student-in-memory.repository";
import { CreateStudentUsecase } from "../create-student/create-student.usecase";
import { UpdateStudentUsecase } from "../update-student/update-student.usecase";
import { Address } from "@core/student/domain/value-object/address.vo";
import { Student, StudentProps } from "@core/student/domain/student.entity";
import { DeleteStudentUsecase } from "../delete-student/delete-student";
import { FindStudentUsecase } from "../find-student/find-student.usecase";

describe("Student use-case unity tests", ()=>{
    let repository: StudentRepositoryInMemory;

    describe("Create student usecase", ()=>{
        let usecase: CreateStudentUsecase;

        beforeEach(()=>{
            repository = new StudentRepositoryInMemory();
            usecase = new CreateStudentUsecase(repository);
        })

        it("should throw error when validate entity", async ()=>{
            
            const input = {
                "first_name": "Jon",
                "last_name": "Silver",
                "date_of_birth": new Date("2015-05-14"), // Invalid date will emit error
                "street": "Flower Street",
                "number": 123,
                "city": "Old York",
                "phone_number": "12345-6789"
            };

            await expect(usecase.execute(input)).rejects.toThrow();
        })

        it("should create a student", async ()=>{
            const spyCreate = jest.spyOn(repository, 'create');

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

            expect(spyCreate).toHaveBeenCalledTimes(1);
            expect(output).toStrictEqual({
                id: repository.entities[0].entityId.id,
                first_name: "Jon",
                last_name: "Silver",
                date_of_birth: new Date("1999-05-14"), 
                street: "Flower Street",
                number: 123,
                city: "Old York",
                phone_number: "12345-6789",
                createdAt: repository.entities[0].createdAt,
                updatedAt: repository.entities[0].updatedAt
            })
        })
    })

    describe("Find student usecase", ()=>{
        let findUseCase: FindStudentUsecase

        beforeEach(()=>{
            repository = new StudentRepositoryInMemory();
            findUseCase = new FindStudentUsecase(repository);
        })

        it("sould find student", async ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                    first_name: "Jony",
                    last_name: "Joseph",
                    date_of_birth: new Date(1999, 11, 17),
                    address: address,
                    phone_number: "99 9999-9999"
            };
    
            let student = new Student(inputStudentProps);
    
            repository.entities = [student]

            const output = await findUseCase.execute({id: student.entityId.id})

            expect(output).toStrictEqual({
                id: repository.entities[0].entityId.id,
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1999, 11, 17), 
                street: "Street",
                number: 400,
                city: "City",
                phone_number: "99 9999-9999",
                createdAt: repository.entities[0].createdAt,
                updatedAt: repository.entities[0].updatedAt
            })
        })
    })

    describe("Update student usecase", ()=>{
        let updateUseCase: UpdateStudentUsecase;

        beforeEach(()=>{
            repository = new StudentRepositoryInMemory();
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
    
            const inputStudentProps: StudentProps = {
                first_name: "Jony",
                last_name: "Joseph",
                date_of_birth: new Date(1999, 11, 17),
                address: address,
                phone_number: "99 9999-9999"
            };
    
            let student = new Student(inputStudentProps);

            repository.entities = [student]
            
            
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
                        createdAt: repository.entities[0].createdAt,
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
                        createdAt: repository.entities[0].createdAt,
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
                        createdAt: repository.entities[0].createdAt,
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
                        createdAt: repository.entities[0].createdAt,
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
                        createdAt: repository.entities[0].createdAt,
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
                        createdAt: repository.entities[0].createdAt,
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
            }
        })
    })

    describe("Delete student usecase", ()=>{
        let deleteUseCase: DeleteStudentUsecase

        beforeEach(()=>{
            repository = new StudentRepositoryInMemory();
            deleteUseCase = new DeleteStudentUsecase(repository);
        })

        it("sould delete student", async ()=>{
            const address = new Address({
                street: "Street",
                number: 400,
                city: "City",
            });
    
            const inputStudentProps: StudentProps = {
                    first_name: "Jony",
                    last_name: "Joseph",
                    date_of_birth: new Date(1999, 11, 17),
                    address: address,
                    phone_number: "99 9999-9999"
            };
    
            let student = new Student(inputStudentProps);
    
            repository.entities = [student]

            await deleteUseCase.execute({id: student.entityId.id})

            expect(repository.entities).toHaveLength(0);
        })
    })
})